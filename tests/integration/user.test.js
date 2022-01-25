import {
  expect
} from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/index';

import fs from 'fs';

const rawdata = fs.readFileSync("./../BOOK-STORE/src/utils/data.json")
const jsondata = JSON.parse(rawdata);
describe('User APIs Test', () => {
  let Token = ''

  before((done) => {
    const clearCollections = () => {
      for (const collection in mongoose.connection.collections) {
        mongoose.connection.collections[collection].deleteOne(() => {});
      }
    };

    const mongooseConnect = async () => {
      await mongoose.connect(process.env.DATABASE_TEST);
      clearCollections();
    };

    if (mongoose.connection.readyState === 0) {
      mongooseConnect();
    } else {
      clearCollections();
    }

    done();
  });

  describe('GET /wellcome', () => {
    it('should return empty array', (done) => {
      request(app)
        .get('/api/v1/')
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(200);
          expect(res.text).to.be.equal('Welcome to Book Store');

          done();
        });
    });
  });


  describe("Post /users/user_registration", () => {
    it("should return registration sucessfull", (done) => {
      request(app).post('/api/v1/users/user_registration').send(jsondata.test1).end((err, res) => {

        expect(res.statusCode).to.be.equal(201);
        expect(res.body).property('message').to.be.equal('User created successfully')
        done();
      })
    })
  })

  describe('Post /users/admin_registration', () => {
    it("should return sucessfull registration", (done) => {
      request(app).post('/api/v1/users/admin_registration').send(jsondata.test2).end((err, res) => {
        expect(res.statusCode).to.be.equal(201);
        expect(res.body).property('message').to.be.equal('User created successfully')
        done();
      })
    })
  })


  describe('Post /users/user_login', () => {
    it("should return sucessfull login", (done) => {
      request(app).post('/api/v1/users/user_login').send(jsondata.login1).end((err, res) => {
        expect(res.statusCode).to.be.equal(200);
        expect(res.body).property('message').to.be.equal('Sucessfully logged in')
        done();
      })
    })
  })

  describe('Post /users/admin_login', () => {
    it("should return sucessfull login", (done) => {
      request(app).post('/api/v1/users/admin_login').send(jsondata.login2).end((err, res) => {

        expect(res.statusCode).to.be.equal(200);
        expect(res.body).property('message').to.be.equal('Sucessfully logged in')
        done();
      })
    })
  })

  describe('Post /users/forgetpassword', () => {
    it("should return sucessfull sent mail", (done) => {
      request(app).post('/api/v1/users/forgetpassword').send(jsondata.forgetPassword1).end((err, res) => {
        Token = res.body.data;
        console.log("token", Token)
        expect(res.statusCode).to.be.equal(200);
        expect(res.body).property('message').to.be.equal('Sucessfully mail Sent')
        done();
      })
    })
  })

  describe('Post /users/resetpassword', () => {
    it("should return sucessfull reset password", (done) => {
      request(app).post('/api/v1/users/resetpassword').set('Authorization', "JWT " + Token).send(jsondata.resetpassword1).end((err, res) => {
        expect(res.statusCode).to.be.equal(200);
        expect(res.body).property('message').to.be.equal('Password Reset Sucessfully')
        done();
      })
    })
  })

});