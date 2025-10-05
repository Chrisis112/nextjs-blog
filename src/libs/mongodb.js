import mongoose from "mongoose";
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGO_URL;

if (!MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGO_URL"');
}

// --- Mongoose connection caching ---
let mongooseCached = global.mongoose;

if (!mongooseCached) {
  global.mongoose = mongooseCached = { conn: null, promise: null };
}

async function connectMongoDB() {
  if (mongooseCached.conn) {
    return mongooseCached.conn;
  }
  if (!mongooseCached.promise) {
    const opts = { bufferCommands: false };
    mongooseCached.promise = mongoose.connect(MONGODB_URI, opts)
      .then(mongooseInstance => {
        console.log("Connected to MongoDB via Mongoose");
        return mongooseInstance;
      })
      .catch(err => {
        mongooseCached.promise = null;
        throw err;
      });
  }
  mongooseCached.conn = await mongooseCached.promise;
  return mongooseCached.conn;
}

// --- MongoClient connection caching ---
const mongoOptions = {};
let mongoClient;
let mongoClientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    mongoClient = new MongoClient(MONGODB_URI, mongoOptions);
    global._mongoClientPromise = mongoClient.connect();
  }
  mongoClientPromise = global._mongoClientPromise;
} else {
  mongoClient = new MongoClient(MONGODB_URI, mongoOptions);
  mongoClientPromise = mongoClient.connect();
}

async function getMongoClient() {
  if (!mongoClientPromise) {
    throw new Error("MongoClient not initialized");
  }
  return await mongoClientPromise;
}

export { connectMongoDB, getMongoClient, mongoClientPromise };
