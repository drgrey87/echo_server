module.exports = {
  echo: {
    port: 2000
  },
  sender: {
    host: 'localhost',
    port: 2001,
    interval_sending: 30000
  },
  queue: {
    name: 'msg',
    watchStuckJobs: 1000*10,
    attempts: 8,
    process_count: 20,
    ui_port: 2002
  }
};