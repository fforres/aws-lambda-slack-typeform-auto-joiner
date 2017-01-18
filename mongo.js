var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var assert = require('assert');
var config = require('./config.json');

var mongoConnection = null;
function connectToMongo(cb) {
  MongoClient.connect(config.mongodb.url, function(err, db) {
    assert.equal(null, err);
    mongoConnection = db;
    cb();
  });
}

function _saveToMongo(data, resolve, reject) {
}
function saveToMongo(data) {
  return new Promise(function(resolve, reject) {
    var collection = mongoConnection.collection('Emails');
    // Insert some documents
    collection.insertOne({
      "email": data.email,
      "firstName": data.firstName,
      "lastName": data.lastName,
    }, function(err, result) {
      if(err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  })
}


function asdasd(){
  connectToMongo(function(){
    console.log("ssss")
    var collection = mongoConnection.collection('Emails');
    collection.find({})
    .toArray(function(err,docs){
      data = docs.map(function(el){return el.email;});
      fs.writeFile('file', data, 'utf8', function(){
        console.log("done")
      })
      // console.log(require('util').inspect(data, { depth: Infinity }));
    })
  })
}

// asdasd();
module.exports = {
  saveToMongo: saveToMongo,
  connectToMongo: connectToMongo,
};
