const axios = require("axios");
const { MongoClient } = require("mongodb");
var client = "";

// Stack class
class Stack {
  // Array is used to implement stack
  constructor() {
    this.items = [];
  }

  // Functions to be implemented
  // push function
  push(element) {
    // push element into the items
    this.items.push(element);
  }

  // pop function
  pop() {
    // return top most element in the stack
    // and removes it from the stack
    // Underflow if stack is empty
    if (this.items.length == 0) return "Underflow";
    return this.items.pop();
  }

  // peek function
  peek() {
    // return the top most element from the stack
    // but does'nt delete it.
    return this.items[this.items.length - 1];
  }

  // isEmpty function
  isEmpty() {
    // return true if stack is empty
    return this.items.length == 0;
  }

  // printStack function
  printStack() {
    var str = "";
    for (var i = 0; i < this.items.length; i++) str += this.items[i] + " ";
    return str;
  }

  //length function
  length() {
    return this.items.length;
  }
}

const init = "home";
const uri =
  "mongodb+srv://sghauri:5262@demo-cluster.ljp3wdf.mongodb.net/?retryWrites=true&w=majority";
var stack = new Stack();
var old = {};
var list = [];
stack.push(init);
start();

async function start() {
  while (!stack.isEmpty()) {
    if (list.length !== 0 && list.length % 100 === 0) {
      console.log("Pushing now!");
      pushToMongo(list);
      list = [];
    }
    let curr = stack.peek();
    if (!onlyChar(curr)) {
      console.log("skipping over " + curr);
      stack.pop();
      continue;
    }
    // console.log("curr : " + curr);
    if (!Object.values(old).includes(curr) && old[curr] != true) {
      await main(stack.pop());
      // console.log(old);
    } else {
      console.log("DELETING  " + curr + " from stack!!");
      stack.pop();
    }
    old[curr] = true;
  }
  // console.log(stack.length());
  console.log("Last push");
  pushToMongo(list);
  console.log("done");
}

async function main(word) {
  let docsList = await getDocs(word);
  resArray = await getSynonyms(word);
  // console.log(resArray);
  obj = createObj(word, resArray);
  // console.log(obj);
  if (docsList.length === 0) {
    storeSynonyms(obj);
  } else {
    console.log("skipped " + word);
    // console.log(old);
  }
  resArray.forEach((e) => {
    if (!Object.values(old).includes(e.word) && old[e.word] != true) {
      stack.push(e.word);
      // console.log("adding : " + e.word);
    }
  });
  // console.log("peek : " +stack.peek());
}

async function getSynonyms(word) {
  const API_URL = "https://api.datamuse.com/words?rel_syn=";
  let data = {};

  await axios
    .get(API_URL + word)
    .then((response) => {
      data = response.data;
    })
    .catch((error) => {
      console.log(error);
    });

  return data;
}

function createObj(word, result) {
  return { word: word, synonyms: result };
}

function onlyChar(str) {
  return /^[A-Za-z]*$/.test(str);
}

function storeSynonyms(obj) {
  list.push(obj);
  // console.log(list.length);
  // console.log(obj);
}

function pushToMongo(list) {
  if (!isConnected()) {
    console.log("Reconnecting in pushToMongo");
    client = new MongoClient(uri);
  }
  try {
    client.connect();
    client.db("MERN_demo").collection("synonyms").insertMany(list);
    console.log("LOGGED!");
  } catch (e) {
    console.error(e);
  } finally {
    // client.close();
  }
}

function isConnected() {
  return !!client && !!client.topology && client.topology.isConnected();
}

async function getDocs(input) {
  if (!isConnected()) {
    console.log("Reconnecting in getDocs");
    client = new MongoClient(uri);
  }
  try {
    await client.connect();
    var coll = await client.db("MERN_demo").collection("synonyms");
    var cursor = await coll.find({ word: input });
    return cursor.toArray();
  } catch (e) {
    console.error("Error:", e);
  } finally {
    // client.close();
  }
}
