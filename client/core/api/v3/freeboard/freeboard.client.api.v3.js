'use strict';

import angular from 'angular';
import apiConfig from '../../../../configs/app.api.config';

export default angular
    .module('freeboard.service.api.v3.module', [])
    .factory('Freeboard', ['$resource', 'LOG_SETTING', function ($resource, LOG_SETTING) {

        const logFlag = LOG_SETTING.FLAG;

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

        return new Controller(logFlag, Freeboard, FreeboardComment);
    }]).name;


function Controller(logFlag, Freeboard, FreeboardComment) {

    const obj = this;
    this.Freeboard = Freeboard;
    this.FreeboardComment = FreeboardComment;

    // variable
    this.busy = false;

    // method 
    this.fetchPage = fetchPage;
    this.fetchDetail = fetchDetail;
    this.save = save;
    this.remove = remove;
    this.saveComment = saveComment;
    this.upvote = upvote;

    function save(title, content, text) {
        return new Promise((resolve, reject) => {
            Freeboard.save({title : title, content : content, text : text}).$promise.then(response => {
                resolve(response.datas);
            }, reason => {
                if (logFlag) console.error(reason.data.devLogs);
                reject(reason.data.errors);
            })
        });
    }

    function remove(id) {
        return new Promise((resolve, reject) => {
            Freeboard.remove({id : id}).$promise.then(response => {
                resolve(response.datas);
            }, reason => {
                if(logFlag) console.log(reason.data.devLogs);
                reject(reason.data.errors);
            })
        })
    }

    /**
     * 
     * @param {*} params 
     * const params = {
            page : Int,
            notice : Boolean,
            keyword : String,
            startDate : String{YYYYMMDD},
            endDate : String{YYYYMMDD},
            order : String{vote, comment, view}
        }
     */
    function fetchPage(params) {
        return new Promise((resolve, reject) => {
            Freeboard.getPage(params).$promise.then(ngResources => {
                resolve(ngResources);
            }, reason => {
                const statusCode = reason.status;
                const result = reason.data;
                if(logFlag) console.log(result.errLog);
                reject(`NOTY.SERVER.${result.errMsg}`);
            })
        })
    }

    function fetchDetail(id) {
        return new Promise((resolve, reject) => {
            Freeboard.getDetail({id : id}).$promise.then(ngResource => {
                resolve(ngResource);
            }, reason => {
                const statusCode = reason.status;
                const result = reason.data;
                if(logFlag) console.log(result.errLog);
                reject(`NOTY.SERVER.${result.errMsg}`);
            })
        })
    }

    function saveComment(id, content) {
        return FreeboardComment.save({id : id, content : content});
    }

    function upvote(id) {
        return Freeboard.upvote({id : id});
    }
}