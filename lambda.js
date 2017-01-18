var start = require('./index.js');
exports.handler = function (event, context) {
  start(function(){
    context.succeed('hello world');
  })
};
