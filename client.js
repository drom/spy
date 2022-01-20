#!/usr/bin/env node
'use strict';

const http = require('http');
const timers = require('timers');
const process = require('process');

const servers = require('./list.js');

const print = (res) => {
  res.map(row => {
    console.log(row.join(': '));
  })
};

const main = () => {
  process.stdout.write('\x1b[A\r'.repeat(servers.length));
  let count = servers.length;
  let result = [];
  servers.map((server, idx) => {
    const name = server.name.toString().padStart(2, '0');
    http.get({
      hostname: server.ip,
      port: 8088,
      path: '/'
    }, (res) => {
      res.on('data', (data) => {
        const obj = JSON.parse(data.toString());
        result[idx] = ['  ' + name, obj.loadavg.map(e => e.toString().padEnd(20)).join('')];
        count--;
        if (count <= 0) {
          print(result);
        }
      });
    }).on('error', () => {
      result[idx] = ['  ' + name, '--'];
      count--;
      if (count <= 0) {
        print(result);
      }
    });
  });
};

console.log('\n'.repeat(servers.length));
setInterval(main, 2000);
