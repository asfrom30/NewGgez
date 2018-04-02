export default {
    globalLogFlag : true,
    devLogFlag : (process.env.NODE_ENV == 'development') ? true : false,
    FLAG : function(){
        return this.globalLogFlag && this.devLogFlag;
    }
}