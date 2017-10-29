'use strict';

const kue = require('kue'),
  config = require('../config/local'),
  moment = require('moment');

const queue = kue.createQueue();
queue.watchStuckJobs(config.queue.watchStuckJobs);

queue.on('ready', () => {
  console.info('Queue is ready!');
});

queue.on('error', (err) => {
  console.error('There was an error in the main queue!');
  console.error(err);
  console.error(err.stack);
});


// // Set up UI
kue.app.listen(config.queue.ui_port);
kue.app.set('title', 'Kue');

function createPayment(data, done) {
  let queue_chain = queue.create(config.queue.name, data)
    .priority('critical')
    .attempts(config.queue.attempts)
    .backoff(true)
    .removeOnComplete(true);

  if (moment().isBefore(data.time)) {
    queue_chain.delay(moment(data.time).diff(moment()))
  }

  queue_chain
    .save(err => {
      if (err) {
        console.error(err);
        done(err);
      }
      if (!err) {
        done();
      }
    });
}

// Process up to 20 jobs concurrently
queue.process(config.queue.name, config.queue.process_count, (job, done) => {
  echo(job.id, job.data, done);
});

function echo(id, data, done) {
  if (moment().isSameOrAfter(data.time)) {
    console.log(data.msg);
    done()
  }
}

queue.active( function( err, ids ) {
  ids.forEach( function( id ) {
    kue.Job.get( id, function( err, job ) {
      job.inactive();
    });
  });
});

module.exports = {
  create: (data, done) => {
    createPayment(data, done);
  }
};