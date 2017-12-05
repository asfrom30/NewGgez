'use strict';

process.env.NODE_ENV = 'test';
var logger = require('../../../utils/logger/logger.core.util');
logger.info('test', 'start player test...');

/* globals describe, expect, it, beforeEach, afterEach */
var app = require('../../../../');
var request = require('supertest');

var newPlayer;

describe('Players API:', function() {

    before(function(done){
        // clean data base..
    })

    describe('GET /:pc/:kr/players/:id', function() {
        var player;
        
        beforeEach(function(done) {
            request(app)
                .get(`/pc/kr/players/1`)
                .expect(404)
                .end((err, res) => {
                    if(err) {
                        return done(err);
                    }
                    player = res.body;
                    done();
                });
        });

        afterEach(function() {
            player = {};
        });

        it('should respond with the requested thing', function() {
            player.name.should.equal('New Thing');
            player.info.should.equal('This is the brand new thing!!!');
        });
    });

    /* Register Test : success case */
    describe('POST /:pc/:kr/players/:id', function() {

        describe('Success case using exist battletag', function() {
            before(function(done){
                var btg = '냅둬라날-3934';
                request(app)
                    .post(`/pc/kr/players/${Btg}`)
                    .expect(200)
                    .expect('Content-Tpe', /json/)
                    .end((err, res) => {
                        if(err) {
                            return done(err);
                        }
                        res.body;
                        done();
                    })
            })

            it('should respond with the requested btg', function() {
                res.body.res_status.should.equal('register success');
            })
        })
        
        // describe('Failure case using not exist battletag', function() {
        //     before(function(done){
        //         var btg = '냅둬라날-39341';
        //     })
        // })
    });



    
});
