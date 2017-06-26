/**
 * Created by socio on 12/25/2016.
 */


var validator = require('validator');

var bCrypt = require('bcrypt-nodejs');
var createHash = function(password){
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}
var isValidPassword = function(user, password){
  return bCrypt.compareSync(password, user.password);
}
module.exports = function (User, Question, Answer) {
  return {
    findOrCreateUser: function (userObj) {
      return new Promise(function (resolve, reject) {
        var email = userObj.email.toLowerCase();
        var password = userObj.password.toString();
        var username = userObj.username.toString();
        var firstName = userObj.firstName.toString();
        var lastName = userObj.lastName.toString();

        if (!validator.isEmail(email)) {
          return reject(new Error('email is not valid'));
        }
        if (!validator.isAlphanumeric(password)) {
          return reject(new Error('Password should contain only letters and numbers'))
        }
        if (!validator.isAlphanumeric(username)) {
          return reject(new Error('Username should contain only letters and numbers'))
        }
        if (!(username.length > 2 && username.length < 13)) {
          return reject(new Error('Username length must be from 3 to 12 chars'));
        }
        if (!(password.length > 2 && password.length < 13)) {
          return reject(new Error('Password length must be from 3 to 12 chars'));
        }
        User.findOne({
          $or: [
            {'username': username},
            {'email': email}
          ]
        }).then(
          function(user){
            if (user) {
              if (user.username === username) {
                return reject(new Error('Username already exists'));
              }
              if (user.email === email) {
                return reject(new Error('Email already exists'));
              }
            }


            // create the user
            var newUser = new User();
            // set the user's local credentials
            newUser.username = username;
            newUser.password = createHash(password);
            newUser.email = email;
            newUser.firstName = firstName;
            newUser.lastName = lastName;

            // save the user
            newUser.save()
              .then(
                user=>{resolve(newUser)},
                err=>{reject(err)}
              )
          },
          err=>{reject(err)}
        )
      });

    },
    findUser: function (req, username, password, done) {
      // check in mongo if a user with username exists or not
      User.findOne({'username': username},
        function (err, user) {
          // In case of any error, return using the done method
          if (err)
            return done(err);
          // Username does not exist, log the error and redirect back
          if (!user) {
            console.log('User Not Found with username ' + username);
            return done(null, false);
          }
          // User exists but wrong password, log the error
          if (!isValidPassword(user, password)) {
            console.log('Invalid Password');
            return done(null, false); // redirect back to login page
          }
          // User and password both match, return user from done method
          // which will be treated like success
          return done(null, user);
        }
      );

    },
    addQuestion: function (title, question, authId) {
      return new Promise(function (resolve, reject) {
        if (!(title.length > 0 && title.length < 64)) {
          return reject(new Error('Title length must be less than 64 and not blank'));
        }
        if (!(question.length > 0 && question.length < 256)) {
          return reject(new Error('Question length must be less than 256 and not blank'));
        }
        var newQuestion = new Question();
        newQuestion.title = title;
        newQuestion.question = question;
        newQuestion.authorId = authId;
        newQuestion.date = Date.now();
        newQuestion.votesUp = 0;
        newQuestion.votesDown = 0;
        newQuestion.save()
          .then(
            question=>{resolve(newQuestion)},
            err=>{reject(err)}
          )
      })

    },
    getUserQuestions: function (userId) {
      return new Promise(function (resolve, reject) {
        Question.find({authorId: userId})
          .then(
            questions=>{resolve(questions)},
            err=>{reject(new Error('Error while getting user"s questions'))}
          )
      })

    },
    getAllQuestions: function () {
      return new Promise(function (resolve, reject) {
        Question.find(null)
          .then(
            questions=>{resolve(questions)},
            err=>{reject(new Error('Error while getting all questions'))}
          )
      })

    },
    addAnswer: function (questionId, answer, authorId, isVoteUp) {
      return new Promise(function (resolve, reject) {
        if (answer.length > 256) {
          return reject(new Error('Answer length should be shorter than 256 chars'))
        }
        var newAnswer = new Answer();
        newAnswer.questionId = questionId;
        newAnswer.answer = answer;
        newAnswer.authorId = authorId;
        newAnswer.isVoteUp = isVoteUp || 0;
        newAnswer.save()
          .then(
            answer=>resolve(newAnswer),
            err=>reject(err)
          )
      })

    },
    getQuestionAnswers: function (questionId) {
      return new Promise(function (resolve, reject) {
        Answer.find({questionId: questionId})
          .then(
            answers=> {
              resolve(answers)
            },
            err=> {
              reject(err)
            }
          )
      })

    },
    findUserById: function (userId) {
      return new Promise(function (resolve, reject) {
        User.findOne({_id: userId})
          .then(
            user=> {
              resolve(user)
            },
            err=> {
              reject(new Error("Error while looking for user with that Id"))
            }
          )
      })

    },
    deleteQuestion: function (questionId, done) {
      return new Promise(function (resolve, reject) {
        Question.findByIdAndRemove(questionId)
          .then(
            function (question) {
              Answer.remove({questionId: questionId})
                .then(
                  answer=> {
                    resolve(question)
                  },
                  err=> {
                    reject(err)
                  }
                )
            },
            err=> {
              reject(err)
            }
          )
      })

    },
    isQuestionOwner: function (ownerId, questionId, done) {
      return new Promise(function (resolve, reject) {
        Question.findOne({_id: questionId})
          .then(
            question=> {
              ownerId == question.authorId ? resolve(true) : resolve(false)
            },
            err=> {
              reject(err)
            }
          )
      })
    }
  }

}