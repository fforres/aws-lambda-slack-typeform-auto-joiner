var https = require('https');
var config = require('./config.json');
var mongo = require('./mongo');

var URL =   config.typeform.url + '/' + config.typeform.form + '?key=' + config.typeform.key + '&completed=true' + '&since=' + Math.floor(new Date() / 1000);
// var URL =   config.typeform.url + '/' + config.typeform.form + '?key=' + config.typeform.key + '&completed=true';
console.log(URL);
console.log()
function getData() {
  https.get(
    URL,
    function(res) {
      var rawData = '';
      res.on('data', (chunk) => rawData += chunk);
      res.on('end', () => {
        try {
          let parsedData = JSON.parse(rawData);
          mongo.connectToMongo(function() {
            analizeData(parsedData);
          })

        } catch (e) {
          console.log(e.message);
        }
      });
  })
}

function analizeData(typeformData) {
  var allPromises = typeformData.responses.map(function(el) {
    return mongo.saveToMongo({
      "email" : el.answers.email_7621345,
      "firstName" : el.answers.textfield_7621343,
      "lastname" : el.answers.textfield_7628461,
    })
  })
  Promise.all(allPromises)
  .then(function(data) {
    console.log(data.length)
  })
  .catch(function(error) {
    console.log("error")
    console.log(error)
  })
  .then(function(){
    console.log("finished")
  })
}

getData()
