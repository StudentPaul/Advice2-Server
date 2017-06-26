/**
 * Created by socio on 12/27/2016.
 */
var mocha = require('mocha');
var assert = require('assert');
var sinon = require('sinon');


describe('Testing test', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});

describe('DAO tests', function () {
  describe('#findOrCreateUser', function () {
    //mock for User mongoose model
    var User = function () {
    };
    User.prototype.save = function () {
      return new Promise(function (resolve, reject) {
        resolve();
      })
    };
    //not found such a user in db
    User.findOne = function (queryObj) {
      return new Promise (function (resolve, reject) {
        resolve(null);
      })
    };
    //DAO filled with stub
    var DAO = require('../models/DAO')(User, null, null);

    it('user with appropriate data registered', function (done) {
      //stub for request object

      var req = {
        username: "Pavlo111",
        password: "1234",
        email: 'soc@ukr.net',
        firstName: "Paul",
        lastName: "Andrusiak"
      };
      //

      DAO.findOrCreateUser(req).then(user=>{done()},error=>{done(error)});
    });
    it('too short name handles Error', function (done) {
      //mock for request object

      var req = {
        username: "Pa",
        password: "1234",
        email: 'soc@ukr.net',
        firstName: "Paul",
        lastName: "Andrusiak"
      };
      //
      DAO.findOrCreateUser(req).then((user)=>{done(err)},err=>{(err.message==='Username length must be from 3 to 12 chars')?done():done(err)});

    })
    it('too long name handles Error', function (done) {
      //mock for request object

      var req = {
        username: "PavloAndrusiak",
        password: "1234",
        email: 'soc@ukr.net',
        firstName: "Paul",
        lastName: "Andrusiak"
      };
      //
      DAO.findOrCreateUser(req).then(
        user=>{done('User is added')},
        function(err){
          assert.equal('Username length must be from 3 to 12 chars', err.message);
          return done()
      });

    })
    it('uncorrect username chars throws Error', function (done) {
      //mock for request object
      var req = {
        username: "ff@ff",
        password: "1234",
        email: 'soc@ukr.net',
        firstName: "Paul",
        lastName: "Andrusiak"
      };
      //
      DAO.findOrCreateUser(req).then(user=>{done('User is added')}, function (err) {
        assert.equal('Username should contain only letters and numbers', err.message);
        return done()
      })

    })
    it('uncorrect password chars throws Error', function (done) {
      //mock for request object
      var req = {
        username: "ffff",
        password: "12 34",
        email: 'soc@ukr.net',
        firstName: "Paul",
        lastName: "Andrusiak"
      };
      //
      DAO.findOrCreateUser(req).then(user=>{done("user created")}, function (err) {
        assert.equal('Password should contain only letters and numbers', err.message);
        return done()
      })

    })
    it('too short password throws Error', function (done) {
      //mock for request object
      var req = {
        username: "ffff",
        password: "3",
        email: 'soc@ukr.net',
        firstName: "Paul",
        lastName: "Andrusiak"
      };
      //
      DAO.findOrCreateUser(req).then(user=>{done('user added')},function (err, user) {
        assert.equal('Password length must be from 3 to 12 chars', err.message);
        return done()
      });

    })
    it('too long password  throws Error', function (done) {
      //mock for request object
      var req = {
        username: "ffff",
        password: "3333222211112",
        email: 'soc@ukr.net',
        firstName: "Paul",
        lastName: "Andrusiak"
      };
      //
      DAO.findOrCreateUser(req).then(user=>{done('User added')},function (err, user) {
        assert.equal('Password length must be from 3 to 12 chars', err.message);
        return done()
      });

    })
    it('invalid email  throws Error', function (done) {
      //mock for request object
      var req = {
        username: "ffff",
        password: "213",
        email: 'socfukr.net',
        firstName: "Paul",
        lastName: "Andrusiak"
      };
      //
      DAO.findOrCreateUser(req).then(user=>{done('User added')},function (err, user) {
        assert.equal('email is not valid', err.message);
        return done()
      });
    })


    it('if username is already in database throws error ', function (done) {
      // change stub's state to find same user in DB
      User.findOne = function (queryObj, done) {
        return done(null, {username:'Pavlo'}) //user with such username was found
      };
      //mock for request object
      var req = {
        username: "Pavlo",
        password: "213",
        email: 'socf@ukr.net',
        firstName: "Paul",
        lastName: "Andrusiak"
      };
      //
      DAO.findOrCreateUser(req).then(user=>{done('userAdded')},function (err, user) {
        assert.equal('Username already exists', err.message);
        return done()
      });

    })
    it('if email is already in database throws error ', function (done) {
      // change stub's state to find same user in DB
      User.findOne = function (queryObj, done) {
        return done(null, {username:'Pavlo2', email:'socio@ukr.net'}) //user with such username was found
      };
      //mock for request object
      var req = {
        username: "Pavlo",
        password: "213",
        email: 'socio@ukr.net',
        firstName: "Paul",
        lastName: "Andrusiak"
      };
      //
      DAO.findOrCreateUser(req).then(user=>{done('user added')},function (err, user) {
        assert.equal('Email already exists', err.message);
        return done()
      })

    })
    it('treat uppercase email and lowcase as the same email ', function (done) {
      // change stub's state to find same user in DB
      User.findOne = function (queryObj, done) {
        return done(null, {username:'Pavlo2', email:'socio@ukr.net'}) //user with such username was found
      };
      //mock for request object
      var req = {
        username: "Pavlo",
        password: "213",
        email: 'SoCio@ukr.Net',
        firstName: "Paul",
        lastName: "Andrusiak"
      };
      //
      DAO.findOrCreateUser(req).then(user=>{done('user added')},function (err, user) {
        assert.equal('Email already exists', err.message);
        return done()
      });

    })
  });
  describe('#addQuestion', function () {
      //stub for User mongoose model
      var Question = function () {
      };
      Question.prototype.save = function (done) {
        return done(null);
      }
      //DAO filled with stub
      var DAO = require('../models/DAO')(null, Question, null);
      //
      it('Title and question appropriate length', function (done) {
        var title ='Question title';
        var question ='Question text';
        DAO.addQuestion(title, question,234234)
          .then(function (user) {
            //assert.equal('saved', user);
            assert.notEqual(null, user)
            assert.equal(user.title, title)
            assert.equal(user.question, question)
            return done()
          })



      });
    it('Too long title handle error', function (done) {
      DAO.addQuestion(Array(20).join("Title"),
        "Question text",234234).then(null, function(err) {
        assert.equal('Title length must be less than 64 and not blank', err.message);
        return done()
      })

    });
    it('Too long question length handle error', function (done) {
      DAO.addQuestion("Question title",
        Array(50).join("Question"),
        234234).then(null, function (err) {
          assert.equal('Question length must be less than 256 and not blank', err.message);
          return done()
        })

    });
    it('Error during "write" operation handled properly', function (done){
      Question.prototype.save = function (done) {
        return done(new Error('Error while writing record'))
      }
      DAO.addQuestion("Qest. title", "question", 23452).then(null, function (err) {
        assert.equal('Error while writing record', err.message)
        return done()
      })
      })
    });
  describe('#addAnswer', function () {
    var Answer = function () {
    };
    Answer.prototype.save = function (done) {
      return done(null);
    };
    var DAO = require('../models/DAO')(null, null, Answer);
    it('Add valid answer', function (done) {
        DAO.addAnswer('324234','Answer is here', '34526',0)
          .then(function(user){
            return done()
          },
            function(){
            return done('error returned')
            })
      });
    it('Too long answer', function (done) {
      DAO.addAnswer('324234',Array(80).join("Answer"), '34526',0)
        .then(answer=>{done('answer added')},
        function(err){
            assert.equal('Answer length should be shorter than 256 chars', err.message);
            done();
          })
    });
    it('Writing error handled properly', function (done) {
      Answer.prototype.save = function (done) {
        return done(new Error('Error while writing record'));
      };
      DAO.addAnswer('324234', 'Answer', '34526', 0)
        .then(answer=> {
            done('answer added')
          },
          function (err) {
            assert.equal('Error while writing record', err.message);
            done();
          })
    });

  });
  describe('#deleteQuestion', function () {
    var Answer = function () {
    };
    Answer.remove = function (obj, done) {
      return done(null);
    };
    var Question = function () {
    };
    Question.findByIdAndRemove = function (id, done) {
      return done(null, {_id: id, title:"title", question: "question"});
    };
    var DAO = require('../models/DAO')(null, Question, Answer);
    it('Successful deleting',function (done) {
      DAO.deleteQuestion(1236, function (err, quest) {
        assert.equal(1236, quest._id);
        assert.equal(null, err);
        done();
      })
    });
    it('If question is not found, handle error',function (done) {
      Question.findByIdAndRemove = function (id, done) {
        return done(new Error('Question not found'));
      };
      DAO.deleteQuestion(1236, function (err, quest) {
        assert('Question not found', err.message)
        done();
      })
    });
    it('If answers cant be removed, handle error',function (done) {
      Answer.remove = function (id, done) {
        return done(new Error('Error while romoving answers'));
      };
      DAO.deleteQuestion(1236, function (err, quest) {
        assert('Error while romoving answers', err.message)
        done();
      })
    });

  });
  describe('#findUser', function () {
    var User = function () {

    }
    User.findOne = function(obj, done){
      return done(null, {_id: 4525, firstName: 'Tom', lastName: 'Bom'})
    }
    var DAO = require('../models/DAO')(User, null, null);

    // it('User is found in database', function (done) {
    //   DAO.findUser({},'Kolobok','1111',function (err, user) {
    //     assert.equal(null, err);
    //     assert.equal('Kolobok',user.username);
    //     assert.equal(!null, user._id);
    //     done()
    //   })
    // })
    it('User wasnt found, handle error', function (done) {
      User.findOne = function (obj,done){
        return done(new Error('User wasnt found'));
      }
      DAO.findUser({},'Kolorbok', '2222', function (err, user) {
        assert('User wasnt found', err.message);
        done()
      })
    })
  });
  describe('#deleteQuestion1', function () {

    it('deleteWithMock',function (done) {
      Answer = {
        remove: function () {

        }
      }
      Question = {
        findByIdAndRemove: function () {

        }
      }
      var answerMock = sinon.mock(Answer);
      var questionMock = sinon.mock(Question);
      answerMock.expects('remove').returns(true);
      questionMock.expects('findByIdAndRemove').once().withArgs(12856).returns(true);
      var DAO = require('../models/DAO')(null, Question, Answer);
      DAO.deleteQuestion(12856, function (err, question) {
        done()
      })
      done()
    })
    // Function under test
    // function once(fn) {
    //   var returnValue, called = false;
    //   return function () {
    //     if (!called) {
    //       called = true;
    //       returnValue = fn.apply(this, arguments);
    //     }
    //     return returnValue;
    //   };
    // }
    //
    // it("returns the return value from the original function", function () {
    //   var myAPI = { method: function () {} };
    //   var mock = sinon.mock(myAPI);
    //   mock.expects("method").once();
    //
    //   var proxy = once(myAPI.method);
    //
    //   assert.equal(proxy(), 42);
    //   mock.verify();
    // });




  });
})