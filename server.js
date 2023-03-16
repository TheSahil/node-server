const http = require('http');
const express = require('express');
const fetch = require('node-fetch');

const hostname = '127.0.0.1';
const port = 8080;

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World');
// });

const server = express();
// /words?rel_trg=cow
server.get('/words', function(req, res) {
  const word = req.query.rel_syn;
  const API_URL = "https://api.datamuse.com/words?rel_syn=";

  fetch(API_URL+word)
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Prints result from `response.json()` in getRequest
        res.send(data);
      })
      .catch((error) => console.error(error));

  // res.send({
  //   'word': word
  // });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
},);