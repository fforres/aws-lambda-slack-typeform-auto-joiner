var https = require('https');
var config = require('./config.json');
var slack = require('./slack.js');
var mongo = require('./mongo');

var URL =   config.typeform.url + '/' + config.typeform.form + '?key=' + config.typeform.key + '&completed=true' + '&since=' + (Math.floor(new Date() / 1000) - (60));
// var URL =   config.typeform.url + '/' + config.typeform.form + '?key=' + config.typeform.key + '&completed=true';
function getData(cb) {
  https.get(
    URL,
    function(res) {
      var rawData = '';
      res.on('data', (chunk) => rawData += chunk);
      res.on('end', () => {
        try {
          var parsedData = JSON.parse(rawData);
          mongo.connectToMongo(function() {
            analizeData(parsedData, cb);
          })

        } catch (e) {
          console.log(e.message);
        }
      });
  })
}

function analizeData(typeformData, cb) {
  var allPromises = typeformData.responses.map(function(el) {
    var data = {
      "email" : el.answers.email_7621345,
      "firstName" : el.answers.textfield_7621343,
      "lastname" : el.answers.textfield_7628461,
    };
    return new Promise(function(resolve, reject){
      mongo.saveToMongo(data)
      .then(function() {
        resolve(data);
      })
      .catch(function(err) {
        reject(err);
      })
    })
  })
  Promise.all(allPromises)
  .then(function(data) {
    return Promise.all(data.map(function(el) {
      console.log(el);
      return slack(el);
    }))
  })
  .then(function(data){
    console.log(data)
  })
  .catch(function(error) {
    console.log("error")
    console.log(error)
  })
  .then(function(){
    console.log("finished")
    if (typeof cb === 'function') {
      cb();
    }
  })
}

module.exports = getData;
