const commonMailer = require('../../../common/utils/mailer/mailer.cron.common.util');


const config = {
    from : 'miraee05@naver.com',
    to : 'asfrom30@gmail.com'
}

module.exports = {
    sendReport : sendReport
}


function sendReport(subject, filePath){
    const from = config.from;
    const to = config.to;

    commonMailer.sendFile(from, to, subject, filePath);
}