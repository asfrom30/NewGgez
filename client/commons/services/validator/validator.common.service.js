import validator from 'validator';

export default angular
    .module('validator.common.service.module', [])
    .factory('validator', function(){
        return validator;
    }).name;