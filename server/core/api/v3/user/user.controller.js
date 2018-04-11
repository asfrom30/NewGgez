// package
const mongoose = require('mongoose');
const passport = require('passport');
const nodemailer = require('nodemailer');
// mongoose model
const UserInvitation = mongoose.model('UserInvitation');
const User = mongoose.model('User');
// custom module
const apiHelper = require('../../core.api.helper');

exports.get = get;
exports.update = update;
exports.signup = signup;
exports.signin = signin;
exports.signout = signout;
exports.createInvitation = createInvitation;
exports.isSignIn = isSignIn;

function get(req, res, next) {
    res.json({ datas: { userProfile: req.user } });
}

function signup(req, res) {

    const sessionID = req.session.id;
    const email = req.body.email;
    const userName = req.body.userName;
    const password = req.body.password;
    const passwordConf = req.body.passwordConf;
    const invitationCode = req.body.invitationCode;

    // Validation
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('userName', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('passwordConf', 'Passwords do not match').equals(req.body.password);

    const formErrors = req.validationErrors();

    if (formErrors) return res.status(422).json({ devLogs: 'server_side_signup_form_is_invalid', errors: { formErrors: formErrors } });

    return Promise.resolve().then(() => {
        return UserInvitation.findOne({ sessionOwnerKey: sessionID });
    }).then(userInvitation => {
        if (!userInvitation) throw apiHelper.make4xxReasonWithClientMsg(422, 'user_invitation_is_not_existed');

        const savedEmail = userInvitation.email;
        if (savedEmail !== email) throw apiHelper.make4xxReasonWithClientMsg(422, 'saved_email_is_different');
        const userInvitationCode = userInvitation.invitationCode + ''; // int to string
        if (userInvitationCode !== invitationCode) throw apiHelper.make4xxReasonWithClientMsg(422, 'invitation_code_is_wrong');
    }).then(() => {
        return User.findOne({ email: email });
    }).then(user => {
        if (user) throw apiHelper.make4xxReasonWithClientMsg(409, 'this_email_is_already_registerd');
        return;
    }).then(() => {
        const newUser = new User({
            email: email,
            userName: userName,
            password: password,
        });
        return newUser.save();
    }).then(() => {
        const datas = { msg2Client: 'register_success', signUpResult: true };
        res.json({ datas: datas });
    }).catch(reason => {
        const code = reason.code || 500;
        const msg2Client = (code == 500) ? 'internal_server_error' : reason.msg2Client;
        res.status(code).json({ devLogs: reason, errors: { msg2Client: msg2Client } });
    })
}

function signin(req, res, next) {
    passport.authenticate('local.signin', function (err, user, info) {

        // 5xx : passport find one mongo error
        if (err) return apiHelper.sendInternalServerError(res, err);

        // 4xx : no error but unprocessable entity
        if (info) return res.status(422).json({ devLogs: info, errors: { msg2Client: info } });

        req.logIn(user, function (err) {
            if (err) return apiHelper.sendInternalServerError(res, err);
            res.json({ datas: { signInResult: true } });
        });
        

    })(req, res, next);
}

function signout(req, res, next) {
    req.logout();
    res.json({ result: true });
}

function createInvitation(req, res) {
    const sessionID = req.session.id;
    const invitationCode = generateInvitationCode();
    const email = req.query.email;

    Promise.resolve().then(() => {
        return UserInvitation.remove({ sessionOwnerKey: sessionID });
    })
        .then(() => {
            return User.findOne({ email: email });
        })
        .then(user => {
            if (user) throw apiHelper.make4xxReasonWithClientMsg(409, 'this_email_is_already_registerd');
        })
        .then(() => {
            const promises = [];
            promises.push(sendInvitationMail(email, invitationCode));
            promises.push(saveInvitation(sessionID, invitationCode, email));
            return Promise.all(promises);
        }).then(() => {
            const datas = { msg2Client: 'send_invitation_code_success', expireAfterSeconds: 300 }; //TODO: NOT HARD WIRE, WIRE FROM MONGOOSE MODEL
            res.json({ datas: datas });
        }).catch(reason => {
            const code = reason.code || 500;
            const msg2Client = (code == 500) ? 'internal_server_error' : reason.msg2Client;
            res.status(code).json({ devLogs: reason, errors: { msg2Client: msg2Client } });
        })
}

function update(req, res, next) {

    const user = req.user;
    const userProfile = req.body.userProfile;

    const doc = {
        userName : userProfile.userName,
        battleTag : userProfile.battleTag,
        battleName : makeBattleName(userProfile.battleTag),
    }
    
    if(!user) return apiHelper.sendInternalServerError(res, 'req.user(passport_user)_is_undefined');

    User.findOneAndUpdate({ _id: user._id }, doc, {new: true}).then(user => {
        res.json({ datas: { msg2Client: 'user_profile_update_success', updateResult : true, userProfile : user.toObject() } });
    }, reason => {
        apiHelper.sendInternalServerError(res, reason);
    })
}

function isSignIn(req, res, next) {
    if (req.isAuthenticated()) {
        res.json({ datas: { isSignin: true } });
    } else {
        res.json({ datas: { isSignin: false } });
    }
}

function generateInvitationCode() {
    const low = 10000;
    const high = 99999;
    return Math.floor(Math.random() * (high - low + 1) + low);
}

function saveInvitation(sessionID, invitationCode, email) {
    const userInvitation = new UserInvitation({
        sessionOwnerKey: sessionID,
        invitationCode: invitationCode,
        email: email
    });

    return userInvitation.save();
}

function sendInvitationMail(targetEmailAddress, invitationCode) {

    return new Promise((resolve, reject) => {
        nodemailer.createTestAccount((err, account) => {

            // create reusable transporter object using the default SMTP transport
            const config = require('../../../../../.secrets/smtp/ggez.smtp').invitationConfig;
            let transporter = nodemailer.createTransport(config);
            let mailContents = createInvitationMailContent(targetEmailAddress, invitationCode);

            // send mail with defined transport object
            transporter.sendMail(mailContents, (error, info) => {
                if (error) return reject(apiHelper.make4xxReasonWithClientMsg(400, error.toString()));
                resolve();
            });
        });
    })
}

function createInvitationMailContent(targetEmailAddress, invitationCode) {
    return {
        from: '<invitation@ggez.kr>', // sender address
        to: targetEmailAddress, // list of receivers
        subject: '✔ Welcome to ggez.kr', // Subject line
        text: 'Thanks for registering', // plain text body
        html: `invitation code : ${invitationCode}`
    };
}

function makeBattleTag(battleTag) {
    if(!battleTag) return;
    return battleTag.replace("#", "-");
}

function makeBattleName(battleTag) {
    if(!battleTag) return;
    return battleTag.substring(0, battleTag.indexOf('#'));
}