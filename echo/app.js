'use strict';

const express = require('express'),
  moment = require('moment'),
  config = require('../config/local'),
  bodyParser = require('body-parser');

const run_app = () => {
  const queue = require('../queue'),
    app = express();

  app.use(bodyParser.json());

  app.post('/api/echo', (req, res) => {
    const order = req.body;
    const success_res = {
      error: null,
      success: true,
      message: 'Successfully created order',
      order
    };

    queue.create(order, (err) => {
      if (err) {
        return res.json({
          error: err,
          success: false,
          message: 'Could not create payment',
        });
      } else {
        return res.json(success_res);
      }
    });
  });

  app.listen(config.echo.port, () => {
    console.log(`Echo listening on port ${config.echo.port}!`);
  });
};

module.exports = {
  run: () => run_app()
};