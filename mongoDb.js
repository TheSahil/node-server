// const { MongoClient } = require("mongodb");
// var client = "";
// client = new MongoClient(uri);
// try {
//   client.connect();
//   var myCursor = client
//     .db("MERN_demo")
//     .collection("synonyms")
//     .find({ word: "home" });
//   //   db.inventory.find( {} )
//   console.log("LOGGED!");
// } catch (e) {
//   console.error(e);
// } finally {
//   client.close();
//   while (myCursor.hasNext()) {
//     console.log(myCursor.next());
//   }
// }

const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://sghauri:5262@demo-cluster.ljp3wdf.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function getDocs(input) {
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

(async function () {
  let docsList = await getDocs("habitation");
  client.close();
  console.log("Fetched documents:", docsList.length);
})();
