'use strict';

import angular from 'angular';
import apiConfig from '../../../../configs/app.api.config';

export default angular
    .module('freeboard.service.api.v3.module', [])
    .factory('Freeboard', ['$resource', function ($resource) {

        let api = `/api/freeboard/:id`;
        if(process.env.NODE_ENV === 'webpack') {
            api = 'http://localhost:9000' + api;
        }

        // setup resource
        const freeboard = $resource(api, {id : '@id'}, {
            getDetail : {
                method : 'GET'
            },
            post : {
                method : 'POST'
            },
            getPage : {
                method : 'GET',
                isArray : true,
            },
            getDetail :{

            },
        })

        const freeboardComment = $resource(`${api}/comments`, {id : '@id'}, {
            
        })


        const Freeboard = function(){
            this.busy = false;
        }

        Freeboard.prototype.fetchPage = function(index) {
            return freeboard.getPage({page : index}).$promise.then(result => {
                return result;
            });
        }

        Freeboard.prototype.fetchDetail = function(id) {
            return freeboard.getDetail({id : id}).$promise.then(result => {
                return result;
            })
        }

        Freeboard.prototype.saveComment = function(id, content) {
            return freeboardComment.save({id : id, content : content});
        }

        Freeboard.prototype.save = function(title, content) {
            return freeboard.save({title : title, content : content});
        }

        return new Freeboard();
        // FreeboardPost.prototype.post = function() {
        //     $resource.$save();
        //     console.log('freeboard on post');  
        // }

        // FreeboardPost.prototype.delete = function() {
        //     console.log('freeboard delete');
        // }

        // FreeboardPost.prototype.nextPage = function() {

        //     console.log('freeboard get next');
        // }

    }]).name;
