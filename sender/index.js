'use strict';

const express = require('express'),
  moment = require('moment'),
  app = express(),
  request = require('request-promise'),
  config = require('../config/local');

const request_data = {
  method: 'POST',
  uri: `http://${config.sender.host}:${config.echo.port}/api/echo`,
  json: true
};
const send_msg = () => {
  setInterval(() => {
    const time = moment().add(1, 'm').format('YYYY-MM-DD HH:mm:ss');
    request_data.body = {
      msg: `Hello, world - ${time}!`,
      time: time
    };
    request(request_data)
      .then(data => console.log('ok'))
      .catch(err => console.error(err));
  }, config.sender.interval_sending);
};

app.listen(config.sender.port, () => {
  console.log(`Sender listening on port ${config.sender.port}!`);
  send_msg();
});