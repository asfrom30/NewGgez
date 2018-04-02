'use strict';

import angular from 'angular';
import apiConfig from '../../../../configs/app.api.config';

export default angular
    .module('freeboard.service.api.v3.module', [])
    .factory('Freeboard', ['$resource', function ($resource) {

        let api = `/api/freeboard/:id`;
        if (process.env.NODE_ENV === 'webpack') {
            api = 'http://localhost:9000' + api;
        }

        // setup resource
        const Freeboard = $resource(api, { id: '@id' }, {
            getDetail: {
                method: 'GET'
            },
            post: {
                method: 'POST'
            },
            getPage: {
                method: 'GET',
                isArray: true,
            },
            upvote : {
                method: 'GET',
                url : `${api}/upvote`
            }
        })

        const FreeboardComment = $resource(`${api}/comments`, { id: '@id' }, {});

        return new Controller(Freeboard, FreeboardComment);
    }]).name;


function Controller(Freeboard, FreeboardComment) {

    const obj = this;
    this.Freeboard = Freeboard;
    this.FreeboardComment = FreeboardComment;

    // variable
    this.busy = false;

    // method 
    this.getFreeboard = getFreeboard;
    this.fetchPage = fetchPage;
    this.fetchDetail = fetchDetail;
    this.save = save;
    this.saveComment = saveComment;
    this.upvote = upvote;

    function getFreeboard() {
        return obj.Freeboard;
    }

    function fetchPage(index) {
        return Freeboard.getPage({ page: index }).$promise.then(result => {
            return result;
        });
    }

    function fetchDetail(id) {
        return Freeboard.getDetail({id : id}).$promise.then(result => {
            return result;
        })
    }

    function saveComment(id, content) {
        return FreeboardComment.save({id : id, content : content});
    }

    function save(title, content, text) {
        return Freeboard.save({title : title, content : content, text : text});
    }

    function upvote(id) {
        return Freeboard.upvote({id : id});
    }
}