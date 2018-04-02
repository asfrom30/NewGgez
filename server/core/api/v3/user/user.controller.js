const mongoose = require('mongoose');
const passport = require('passport');
const nodemailer = require('nodemailer');
const UserInvitation = mongoose.model('UserInvitation');
const User = mongoose.model('User');

exports.get = get;
exports.update = update;
exports.signup = signup;
exports.signin = signin;
exports.signout = signout;
exports.createInvitation = createInvitation;
exports.checkStatus = checkStatus;

function get(req, res, next) {
    if (req.isAuthenticated()) {
        res.json({ result: req.user });
    } else {
        res.json({ result: null });
    }
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

    const errors = req.validationErrors();

    if (errors) {
        return res.status(422).json({ err: errors });
    }

    return Promise.resolve().then(() => {
        return UserInvitation.findOne({ sessionOwnerKey: sessionID });
    }).then(userInvitation => {
        if (!userInvitation) throw makeReason(422, { msg: 'user_invitation_is_not_existed' });

        const userInvitationCode = userInvitation.invitationCode + ''; // int to string
        if (userInvitationCode !== invitationCode) throw makeReason(422, { msg: 'invitation_code_is_wrong' });
        return;
    }).then(() => {
        return User.findOne({ email: email });
    }).then(user => {
        if (user) throw makeReason(409, { msg: 'this_email_is_already_registerd' });
        return;
    }).then(() => {
        const newUser = new User({
            email: email,
            username: userName,
            password: password,
        });
        return newUser.save();
    }).then(() => {
        res.status(200).json({ result: true, msg: 'register_success' });
    }).catch(reason => {
        const code = reason.code || 500;
        if (code == 500) {
            res.status(500).json({ errMsg : 'internal_server_error', reason : reason });
        } else {
            res.status(code).json({ errors: reason.errors });
        }
    })
}

function signin(req, res, next) {
    passport.authenticate('local.signin', function (err, user, info) {

        if (err) { return res.status(500).json({ err: 'internal_server_error' }) };
        if (info) { return res.status(422).json({ err: 'check_info_message', info: info }) };
        if (!user) { return res.status(422).json({ err: 'no_user_found' }) };

        req.logIn(user, function (err) {
            if (err) { return res.status(500).json({ err: 'internal_server_error' }) }
            return res.json({ result: true });
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
    const targetEmailAddress = req.query.email;

    Promise.resolve().then(() => {
        return UserInvitation.remove({sessionOwnerKey : sessionID});
    }).then(() => {
        const promises = [];
        promises.push(sendInvitationMail(targetEmailAddress, invitationCode));
        promises.push(saveInvitation(sessionID, invitationCode));
        return  Promise.all(promises);
    }).then(() => {
        res.json({ result: true, msg: 'success' });
    }).catch(reason => {
        const code = reason.code || 500;
        if (code == 500)  res.status(500).json({ errMsg : 'internal_server_error', reason : reason });
        else res.status(code).json({ errors: reason.errors });
    })
}

function update(req, res, next) {
    if (!req.isAuthenticated()) res.status(401).json({ err_msg: "not_logged_in" });

    const email = req.user.email;

    const doc = {};
    if (req.body.password) doc.password = req.body.password + '';
    if (req.body.battletag) doc.battletag = req.body.battletag;


    User.findOneAndUpdate({ email: email }, doc).then(result => {
        return res.status(200).json({ result: true, msg: 'USER_ACCOUNT_UPDATE_SUCCESS' });
    }, reason => {
        return res.status(500).json({ errMsg: 'INTERNAL_SERVER_ERROR', reason: reason });
    })
}

function checkStatus(req, res, next) {
    if (req.isAuthenticated()) {
        res.json({ result: true });
    } else {
        res.json({ result: false });
    }
}

function generateInvitationCode() {
    const low = 10000;
    const high = 99999;
    return Math.floor(Math.random() * (high - low + 1) + low);
}

function saveInvitation(sessionID, invitationCode) {
    const userInvitation = new UserInvitation({
        sessionOwnerKey: sessionID,
        invitationCode: invitationCode,
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
                if (error) return reject(makeReason(400, error.toString()));
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

function makeReason(code, error) {
    return {
        code: code,
        errors: [
            error
        ]
    }
}
