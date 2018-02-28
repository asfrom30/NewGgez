'use strict';

import 'noty/lib/noty.css';
import Noty from 'noty';


export default angular
    .module('noty.core.service.module', [])
    .factory('Noty', function(){

        const theme = 'sunset';

        return {
            show : function(text, type, timeout, onClose){
                const setting = {
                    theme : theme,
                    type : type || 'info',
                    timeout : timeout || 1500,
                    text : text,
                    callbacks: {
                        onClose: onClose,
                    }
                }
                new Noty(setting).show();
            },
        }
    }).name;