'use strict';

process.env.NODE_ENV = 'test';
var logger = require('../../../utils/logger/logger.core.util');
logger.info('test', 'start player profile test...');

/* globals describe, expect, it, beforeEach, afterEach */
var app = require('../../../../');
var request = require('supertest');

var newPlayerProfile;

describe('Player Profile API:', function() {
  describe('GET /:pc/:kr/player-profiles/:id', function() {
    var playerProfile;
    
    beforeEach(function(done) {
      request(app)
        .get(`/pc/kr/player-profiles/1`)
        // .get(`/pc/kr/player-profiles/${newPlayerProfile._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          playerProfile = res.body;
          done();
        });
    });

    afterEach(function() {
      playerProfile = {};
    });

    it('should respond with the requested thing', function() {
      playerProfile.name.should.equal('New Thing');
      playerProfile.info.should.equal('This is the brand new thing!!!');
    });
  });
});
