const nodemailer = require('nodemailer');
const account = require('../../../.smtp/account');

exports.sendMail = function(from, to, subject, text) {
    const mailOptions = getMailOptions(from, to, subject, text, null);
    send(mailOptions);
}

exports.sendFile = function(from, to, subject, filePath) {
    const attachment = [{path : filePath}];
    const mailOptions = getMailOptions(from, to, subject, null, attachment);
    send(mailOptions);
}

exports.sendFiles = function(from, to, subject, filePaths) {
    let attachments = [];
    for(let filePath of filePaths){
        attachments.push({path : filePath});
    }
    const mailOptions = getMailOptions(from, to, subject, null, attachments);
    send(mailOptions);
}

function send(mailOptions) {
    let transporter = nodemailer.createTransport(account);
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        } else {
            console.log('send mail complete');
        }
    });
}

function getMailOptions(from, to, subject, text, attachments) {
    let mailOptions = {};
    mailOptions.from = from;
    mailOptions.to = to;
    mailOptions.subject = subject;
    mailOptions.text = text;
    mailOptions.attachments = attachments;
    return mailOptions;
}