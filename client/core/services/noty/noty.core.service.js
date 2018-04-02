'use strict';

import 'noty/lib/noty.css';
import Noty from 'noty';


export default angular
    .module('noty.core.service.module', [])
    .factory('Noty', function($translate){

        const theme = 'sunset';

        return {
            show : function(text, type, timeout, onClose){
                const setting = {
                    theme : theme,
                    type : type || 'info',
                    timeout : timeout || 1500,
                    callbacks: {
                        onClose: onClose,
                    }
                }

                $translate(text).then(result => {
                    return result; // translated text
                }, reason => {
                    return reason; // not translated text
                }).then(text => {
                    setting.text = text;
                    new Noty(setting).show();
                })
            },
        }
    }).name;