const express = require("express");
const axios = require("axios");
const MongoClient = require("mongodb");
const { timeStamp, time } = require("console");
const uri =
  "mongodb+srv://sghauri:5262@demo-cluster.ljp3wdf.mongodb.net/?retryWrites=true&w=majority";

const hostname = "127.0.0.1";
const port = 8080;

const server = express();

server.get("/words", function (req, res) {
  const word = req.query.rel_syn;
  var user = {
    agent: req.header("user-agent"), // User Agent we get from headers
    referrer: req.header("referrer"), //  Likewise for referrer
    ip: req.header("x-forwarded-for") || req.connection.remoteAddress, // Get IP - allow for proxy
    query: word,
    headersString: JSON.stringify(req.headers),
    timestamp: Date.now(),
  };

  const client = new MongoClient(uri);

  try {
    client.connect();
    client.db("MERN_demo").collection("logs").insertOne(user);
    console.log("Logged!");
  } catch (e) {
    console.error(e);
  } finally {
    client.close();
  }

  const API_URL = "https://api.datamuse.com/words?rel_syn=";
  let data = {};

  axios
    .get(API_URL + word)
    .then(function (response) {
      console.info("Request received for : " + word + " from : " + user.ip);
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
