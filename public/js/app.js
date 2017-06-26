/**
 * Created by socio on 12/30/2016.
 */
function header() {
  return [
    m('#header', [
      m('i',{},'Advice'),
      m('a', {config:m.route, href:'/allQuestions'}, 'All questions'),
      m('a', {config:m.route, href:'/add'}, 'Add question'),
      m('a', {config:m.route, href:'/registration'}, 'Registration'),
      m('a', {config:m.route, href:'/login'}, 'Login'),
      m('a', {config:m.route, href:'/logout'}, 'Logout'),

    ]),
    m('hr'),
  ]
}
/**
 * Created by socio on 12/30/2016.
 */

var addQuestion = {};
/**
 * Created by socio on 12/30/2016.
 */

var login = {};
/**
 * Created by socio on 12/30/2016.
 */

var main = {};
/**
 * Created by socio on 12/30/2016.
 */
var questions ={};

questions.vm = (function() {
  var vm = {};
  vm.init = function() {
    vm.list = null;
    vm.answerList = null;
    vm.listReady = false;
    vm.activeQuestion = m.prop('');
    m.request({method: "GET", url: "/getAllQuestions"}).then(function (item) {
      var toReturn = JSON.parse(item);
      vm.list= new Array(toReturn);
    })
  };
  return vm;
}());
/**
 * Created by socio on 12/30/2016.
 */

var registration = {};
/**
 * Created by socio on 12/30/2016.
 */

addQuestion.controller = function () {

};
/**
 * Created by socio on 12/30/2016.
 */

login.controller = function () {

};
/**
 * Created by socio on 12/30/2016.
 */

main.controller = function () {

};
/**
 * Created by socio on 12/30/2016.
 */
questions.controller = function () {
  questions.vm.init();
  return {
    answer: function (questionId) {
      questions.vm.activeQuestion(questionId);
      this.fetchAnswers();
    },
    fetchAnswers: function () {
      m.request({method: "GET", url: "/getQuestionAnswers/"+questions.vm.activeQuestion()}).then(function (item) {
        var toReturn = JSON.parse(item);
        questions.vm.answerList= new Array(toReturn);
      })
    },
    fetchMyQuestions: function () {
      m.request({method: "GET", url: "/getOwnQuestions"}).then(function (item) {
        var toReturn = JSON.parse(item);
        questions.vm.list= new Array(toReturn);
      })
    },
    fetchAllQuestions: function () {
      m.request({method: "GET", url: "/getAllQuestions"}).then(function (item) {
        var toReturn = JSON.parse(item);
        questions.vm.list= new Array(toReturn);
      })
    },
    isSelected: function (currentItem) {
      return (currentItem._id ===questions.vm.activeQuestion());
    }
  }
};
/**
 * Created by socio on 12/30/2016.
 */

registration.controller = function () {

};
/**
 * Created by socio on 12/30/2016.
 */

addQuestion.view = function () {
  return [
    header(),
    m('form',{class:'form-signin', action:'/addQuestion', method:'POST'},[
      m('input',{type:'text', name:'title', class:'form-control', placeholder:'Question title',required:'true', autofocus:'true'}),
      m('input',{type:'text', name:'question', class:'form-control', placeholder:'Your question',required:'true'}),
      m('button',{class:'btn btn-lg btn-primary btn-block', type:'submit'},'Post question')
    ])
  ]
};
/**
 * Created by socio on 12/30/2016.
 */

login.view = function () {
  return [
    header(),
    m('form',{class:'form-signin', action:'/login', method:'POST'},[
      m('input',{type:'text', name:'username', class:'form-control', placeholder:'Username',required:'true', autofocus:'true'}),
      m('input',{type:'password', name:'password', class:'form-control', placeholder:'Password',required:'true'}),
      m('button',{class:'btn btn-lg btn-primary btn-block', type:'submit'},'login')
    ])


  ]
};
/**
 * Created by socio on 12/30/2016.
 */

main.view = function () {
  return [
    header(),
    m("div","welcome, my friend, to Advice family")
  ]
};
/**
 * Created by socio on 12/30/2016.
 */

questions.view = function (ctrl) {
  return[
    header(),
    m('button',{onclick: ctrl.fetchMyQuestions.bind(ctrl), class:'btn btn-lg btn-primary btn-block'},'Show only my questions'),
    m('button',{onclick:ctrl.fetchAllQuestions.bind(ctrl), class:'btn btn-lg btn-primary btn-block'},'Show all questions'),
    m("table", [
      (questions.vm.list)?questions.vm.list[0].map(function(question, index) {
        return m("div",{class:"question-block", selected: ctrl.isSelected(question)},m("tr", [
          m("h1",{},m("td", {}, question.title )),
          m("td", {}, question.question),
          m('button',{onclick: ctrl.answer.bind(ctrl,question._id), class:'btn btn-lg btn-primary btn-block'},'Select'),
          m('button',{onclick: function () {
            document.location = "/deleteQuestion/"+question._id;
          }, class:'btn btn-lg btn-primary btn-block'},'Delete')
        ]))
      }):m('div',{},'No questions found')
    ]),
    m('form',{class:'form-signin', action:'/answerQuestion', method:'POST'},[
      m('input',{onchange: m.withAttr("value", questions.vm.activeQuestion), value: questions.vm.activeQuestion(),
        type:'text', name:'questionId', class:'form-control', placeholder:'Question ID',required:'true', autofocus:'true'}),
      m('input',{type:'text', name:'answer', class:'form-control', placeholder:'Answer',required:'true', }),
      m('button',{class:'btn btn-lg btn-primary btn-block', type:'submit'},'Answer')
    ]),

    m("table", [
      (questions.vm.answerList)?questions.vm.answerList[0].map(function(answer, index) {
        return m("div",{class:"answer-block"},m("tr", [
          m("td", {}, answer.author ),
          m("td", {}, answer.answer),
          m("td", {}, answer.date),
        ]))
      }):[]
    ])
  ]

};
/**
 * Created by socio on 12/30/2016.
 */

registration.view = function () {
  return [
    header(),
    m("form",{class:'form-signin', action:'/signup', method:'POST'},[
      m("input",{type : "text", name : 'username', class: "form-control nomargin", placeholder:'Username',required:"true",autofocus:"true"}),
      m("br"),
      m("input",{type:'password', name:'password', class:'form-control nomargin', placeholder:'Password', required:"true"}),
      m("br"),
      m("input", {type:'email', name:'email', class:'form-control', placeholder:'Email',required:"true"}),
      m("br"),
      m("input",{type:'text', name:'firstName', class:'form-control', placeholder:'First Name',required:"true"}),
      m("br"),
      m("input",{type:'text', name:'lastName', class:'form-control', placeholder:'Last Name',required:"true"}),
      m("br"),
      m("button",{class:'btn btn-lg btn-primary btn-block', type:'submit'},"Register")
    ])
  ]
};
/**
 * Created by socio on 12/30/2016.
 */

m.route.mode = "hash";
m.route(document.body, "/", {
  "/": main,
  "/login": login,
  "/registration": registration,
  "/add": addQuestion,
  "/allQuestions": questions
});