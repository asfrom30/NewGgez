export default {

    //FIXME: this setting mustbe declared from server
    freeboard : {
        title : {
            minStringLength : 5,
            maxStringLength : 50,
        },
        content : {
            minStringLength : 5,
            maxStringLength : 1000,
            maxFileSize : '5mb',
        }
    },
    comment : {
        minStringLength : 5,
        maxStringLength : 300,
    }
}