const cluster = require('cluster');
  //Code to run if we’re in the master process
  if (cluster.isMaster) {
    // Count the machine’s CPUs
    var cpuCount = require('os').cpus().length;
    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }
  // Code to run if we’re in a worker process
  } else {

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const servers = ['http://ec2-54-241-187-195.us-west-1.compute.amazonaws.com:3002', 
                 'http://ec2-13-52-78-3.us-west-1.compute.amazonaws.com:3002',
                 'http://ec2-13-57-247-157.us-west-1.compute.amazonaws.com:3002'
                ];

let cur = 0; 

const handler = (req, res) => {
  // Add an error handler for the proxied request
  const _req = request({ url: servers[cur] + req.url }).on('error', error => {
    res.status(500).send(error.message);
  });
  req.pipe(_req).pipe(res);
  cur = (cur + 1) % servers.length;
};
const server = express().get('*', handler).post('*', handler);

server.listen(8080, () => {
    console.log('Listening on port 8080');
});

};