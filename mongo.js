var MongoClient = require('mongodb').MongoClient;
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

module.exports = {
  saveToMongo: saveToMongo,
  connectToMongo: connectToMongo,
};
