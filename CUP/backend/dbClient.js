// dbClient.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.mongoURI; // ensure .env has mongoURI
if (!uri) {
  throw new Error('mongoURI not defined in environment variables');
}

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Optional: connect here or lazily in routers
async function connectClient() {
  if (!client.isConnected?.()) {
    await client.connect();
  }
  return client;
}

module.exports = {
  client,
  connectClient,
};
