import mongoose from 'mongoose';

let mongoMemoryServer: any = null;

export const connectDB = async (): Promise<boolean> => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/abes-club-connect';

  // 1. Try connecting to configured MongoDB (e.g. local or MongoDB Atlas)
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`✅ MongoDB Connected to: ${mongoose.connection.host}/${mongoose.connection.name}`);
    return true;
  } catch (err: any) {
    console.warn(`⚠️ Local MongoDB not detected at "${uri}". Attempting In-Memory MongoDB Server...`);
  }

  // 2. Fallback to MongoMemoryServer
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongoMemoryServer = await MongoMemoryServer.create({
      instance: {
        dbName: 'abes-club-connect',
      },
    });
    const memoryUri = mongoMemoryServer.getUri();
    await mongoose.connect(memoryUri);
    console.log(`✅ In-Memory MongoDB running at: ${memoryUri}`);
    return true;
  } catch (memErr: any) {
    console.warn(`⚠️ MongoMemoryServer binary download skipped/unavailable: ${memErr.message}`);
    console.warn(`💡 Tip: Run a local MongoDB server or set MONGO_URI in server/.env for persistent storage.`);
    return false;
  }
};

export const closeDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
    }
  } catch {
    // ignore
  }
};
