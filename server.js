const express = require("express");
// const fetch = require('node-fetch');
const axios = require("axios");

const hostname = "127.0.0.1";
const port = 8080;

const server = express();
// /words?rel_trg=cow
server.get("/words", function (req, res) {
  const word = req.query.rel_syn;
  var user = {
    agent: req.header('user-agent'), // User Agent we get from headers
    referrer: req.header('referrer'), //  Likewise for referrer
    ip: req.header('x-forwarded-for') || req.connection.remoteAddress, // Get IP - allow for proxy
    screen: { // Get screen info that we passed in url post data
      width: req.params.height,
      height: req.params.width
    }
  };
  // console.log(JSON.stringify(req.headers));

  const API_URL = "https://api.datamuse.com/words?rel_syn=";
  let data = {};

  axios
    .get(API_URL + word)
    .then(function (response) {
      console.info("Request received for : "+word+" from : "+user.ip);
      data = response.data;
    })
    .catch(function (error) {
      // handle error
      console.error(error);
    })
    .finally(function () {
      // always executed
      res.send(data);
    });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
