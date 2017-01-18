var request = require('request');
var config = require('./config.json');
var querystring = require('querystring');

var channelsUrl = 'https://slack.com/api/channels.list?token='+config.slack.key+'&exclude_archived=1&pretty=1';
var inviteUrl = 'https://slack.com/api/users.admin.invite';

function invite(data) {
  return new Promise(function(resolve, reject){
    request.post({
      url: inviteUrl,
      form: {
        email: data.email,
        channels: config.slack.ids,
        first_name: data.nombre,
        last_name: data.apellido,
        token: config.slack.key,
        set_active: true
      }
    }, function(err, httpResponse, body) {
      var parsedBody = JSON.parse(body);
      if(parsedBody.error === 'already_invited' || parsedBody.ok === 'ok'){
        // Update mongo (invited)
        resolve('ok')
      } else {
        reject(parsedBody.error);
      }
    })
  })
}
module.exports = invite;
