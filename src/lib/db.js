import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 3000,
    };

    cached.promise = (async () => {
      try {
        const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lemonelegance';
        const conn = await mongoose.connect(uri, opts);
        console.log(`[Next DB] Connected to MongoDB: ${conn.connection.host}`);
        return conn;
      } catch (err) {
        console.log('[Next DB] Local MongoDB not reachable. Trying MongoDB Memory Server...');
        try {
          const { MongoMemoryServer } = require('mongodb-memory-server');
          const mongod = await MongoMemoryServer.create();
          const uri = mongod.getUri();
          const conn = await mongoose.connect(uri, opts);
          console.log(`[Next DB] In-Memory MongoDB Connected at: ${uri}`);
          return conn;
        } catch (memErr) {
          console.error('[Next DB] Failed to connect to MongoDB:', memErr.message);
          throw memErr;
        }
      }
    })();
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
