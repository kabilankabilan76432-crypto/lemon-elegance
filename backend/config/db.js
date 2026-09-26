const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[Database] MongoDB Connected to local/URI instance: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.log('[Database] Local MongoDB instance not reachable. Initializing In-Memory MongoDB Server...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`[Database] In-Memory MongoDB Connected successfully at: ${uri}`);
      return conn;
    } catch (memErr) {
      console.error(`[Database] Error starting MongoDB Memory Server: ${memErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
