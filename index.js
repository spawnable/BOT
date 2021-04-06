#!/usr/bin/env node
const fs = require('fs')
const env = process.env

let obj = {
  key: fs.readFileSync(env.key),
  cert:fs.readFileSync(env.cert)
}
if (env.ca) {
  obj.ca = fs.readFileSync(env.ca); 
}

let count = 0

function out (req, res) {
  res.statusCode = 200
  res.setHeader('Content-Type','text/plain')
  for (var k in env) {
    res.write(k + ": " + env[k] + "\n")
  };
  console.log(count++,req.url)
  res.end()
};

require('http').createServer(out).listen(env.http, env.host)
require('https').createServer(obj, out).listen(env. https, env.host)