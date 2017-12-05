var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function(){

    this.schema = new Schema({
        _id         : String,
        _meta       : Object,
        _value      : Object
    }),
    
    this.get = function(){
        return this.schema;
    }

    return this;
}();