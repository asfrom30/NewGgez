'use strict';

import angular from 'angular';
import apiConfig from '../../../../configs/app.api.config';

export default angular
    .module('freeboard.api.v3.service.module', [])
    .factory('Reddit', ['$resource', '$http', function($resource, $http){


        var Reddit = function() {
            this.items = [];
            this.busy = false;
            this.after = '';
        };

        Reddit.prototype.nextPage = function() {
            if (this.busy) return;
            this.busy = true;

            
        
            var url = "https://api.reddit.com/hot?after=" + this.after + "&jsonp=JSON_CALLBACK";
            $http.jsonp(url).then(function(data) {
                var items = data.data.children;
                for (var i = 0; i < items.length; i++) {
                this.items.push(items[i].data);
                }
                this.after = "t3_" + this.items[this.items.length - 1].id;
                this.busy = false;
            }.bind(this));
        };
        
        return Reddit;

        // let api = `/:device/:region/index-information`;
        
        // /* if need dummie, not yet impl server */
        // const env = process.env.NODE_ENV;
        // if(env === 'webpack') api = apiConfig.baseUri + '/index-information/1.json';

        // return $resource(api, {}, {})
    }]).name;
