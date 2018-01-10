const nodemailer = require('nodemailer');
const account = require('../../../.smtp/account');

exports.sendMail = function(from, to, subject, text) {
    const mailOptions = getMailOptions(from, to, subject, text, null);
    send(mailOptions);
}

exports.sendFile = function(from, to, subject, filePath) {
    const mailOptions = getMailOptions(from, to, subject, null, filePath);
    send(mailOptions);
}

function send(mailOptions) {
    let transporter = nodemailer.createTransport(account);
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
    });
}

function getMailOptions(from, to, subject, text, filePath) {
    let mailOptions = {};
    mailOptions.from = from;
    mailOptions.to = to;
    mailOptions.subject = subject;
    mailOptions.text = text;
    mailOptions.attachments = [{path : filePath}];
    return mailOptions;
}