"use strict";

var paperboy = require('paperboy'),
    http = require('http'),
    path = require('path');

var webroot = path.join(__dirname, 'dist'),
    port = 80;

http.createServer(function(req, res) {
  var ip = req.connection.remoteAddress;
  paperboy
    .deliver(webroot, req, res)
    .addHeader('X-Powered-By', 'Chessimator2000')
    .before(function() {
      console.log('Request received for ' + req.url);
    })
    .after(function(statusCode) {
      console.log(statusCode + ' - ' + req.url + ' ' + ip);
    })
    .error(function(statusCode, msg) {
      console.log([statusCode, msg, req.url, ip].join(' '));
      res.writeHead(statusCode, { 'Content-Type': 'text/plain' });
      res.end('Error [' + statusCode + ']');
    })
    .otherwise(function(err) {
      console.log([404, err, req.url, ip].join(' '));
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Error 404: File not found');
    });
}).listen(port);

console.log('paperboy on his round on port: ' + port);
