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
  let Token = '';
let BookID='';  

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


  describe('Post login admin and add books', () => {
    it("login and add books", (done) => {
      request(app).post('/api/v1/users/admin_login').send(jsondata.login2).end((err, res) => {

        expect(res.statusCode).to.be.equal(200);
        expect(res.body).property('message').to.be.equal('Sucessfully logged in')
       let  admin_login_token=res.body.data

       request(app).post('/api/v1/books/').set('Authorization', "JWT " +admin_login_token).send(jsondata.Book1).end((err, res) => {
        expect(res.statusCode).to.be.equal(201);
        expect(res.body).property('message').to.be.equal('Created Book Sucessfully')
        BookID=res.body.data._id
        done();
        });

      })
    })
  })


  describe('POST login admin and update Book by ID', () => {
    it("login and update book", (done) => {
      request(app).post('/api/v1/users/admin_login').send(jsondata.login2).end((err, res) => {
        expect(res.statusCode).to.be.equal(200);
        expect(res.body).property('message').to.be.equal('Sucessfully logged in')
       let  admin_login_token=res.body.data

        const updateBook = {
         "title": "Movie"
        }
        request(app).patch(`/api/v1/books/${BookID}`).set('Authorization', "JWT " +admin_login_token).send(updateBook).end((err, res) => {
          expect(res.statusCode).to.be.equal(200);
          expect(res.body).property('message').to.be.equal('Updated Book Sucessfully')
          done();
        });

      })
    })
  })

  
  describe('GET /books/', () => {
    it("should return All fetch book", (done) => {
      request(app).get('/api/v1/books/').end((err, res) => {

        expect(res.statusCode).to.be.equal(200);
        expect(res.body).property('message').to.be.equal('Sucessfully Fetched all Books')
        done();
      })
    })
  })

  describe('GET /books/:_id', () => {
    it("should return fetch book by id", (done) => {
      request(app).get(`/api/v1/books/${BookID}`).end((err, res) => {

        expect(res.statusCode).to.be.equal(200);
        expect(res.body).property('message').to.be.equal('Sucessfully Fetched Book')
        done();
      })
    })
  })

  
  describe('Post login admin and delete book', () => {
    it("login and add books", (done) => {
      request(app).post('/api/v1/users/admin_login').send(jsondata.login2).end((err, res) => {

        expect(res.statusCode).to.be.equal(200);
        expect(res.body).property('message').to.be.equal('Sucessfully logged in')
       let  admin_login_token=res.body.data

       request(app).delete(`/api/v1/books/${BookID}`).set('Authorization', "JWT " +admin_login_token).send(jsondata.Book1).end((err, res) => {
        expect(res.statusCode).to.be.equal(200);
        expect(res.body).property('message').to.be.equal('Sucessfully Deleted')
        BookID=res.body.data._id
        done();
        });

      })
    })
  })
 
  
});