const assert = require('assert');
const request = require('supertest');
const should = require('should');

const mongoHelperFactory = require('./mongo.db.helper.factory');
const lib = require('./mongo.db.helper');
mongoHelperFactory.setDbUri("mongodb://localhost/", 'mocha_test_db');
const mongoHelper = mongoHelperFactory.getInstance();


describe('■ MongoHelper Unit Test : ', function(){
    before(function(done){
        mongoHelper.createCollection('drop_collection')
            .then(result => {
                done();
            })
    });

    describe('-. Drop Collection Test : ', function(){
        it(' : should work well drop collection even not exist', function(done){
            mongoHelper.dropCollection('drop_collection')
                .then(result =>{
                    done();
                }, reason => {
                    done(new Error(reason));
                })
        })
    })
})

/* Skeleton */
// describe('■ MongoHelper Unit Test : ', function(){
//     // before(function(done){

//     // });

//     // beforeEach(function(done){

//     // })

//     describe('-. Drop Collection Test : ', function(){
//         it(' : should work well drop collection even not exist', function(done){
//         })
//     })
// })