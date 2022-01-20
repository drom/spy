#!/usr/bin/env node
'use strict';

const http = require('http');
const os = require('os');

const getIpAddr = () => {
  const nets = os.networkInterfaces();
  const res = [];
  for (const netName of Object.keys(nets)) {
    for (const net of nets[netName]) {
      if (net.family === 'IPv4' && !net.internal) {
        res.push(net.address);
      }
    }
  }
  return res;
};

console.log(getIpAddr());

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify({
    loadavg: os.loadavg()
  }));
});

server.listen(8088);
