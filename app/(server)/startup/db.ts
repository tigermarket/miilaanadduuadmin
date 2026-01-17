import mongoose from "mongoose";

const MONGODB_URI: string = process.env.MONGODB_UI as string;

if (!MONGODB_URI) {
  console.log("Invalid/Missing environment variable", MONGODB_URI);
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

type CachedMongoose = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

let globalWithMongoose = global as typeof globalThis & {
  _mongooseClient?: CachedMongoose;
};

if (!globalWithMongoose._mongooseClient) {
  globalWithMongoose._mongooseClient = { conn: null, promise: null };
}

const cached = globalWithMongoose._mongooseClient;

export async function connectedToMongodb(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  try {
    if (!cached.promise) {
      cached.promise = mongoose.connect(MONGODB_URI, {
        bufferCommands: false,
        dbName: "financialDashboard",
      });
    }

    cached.conn = await cached.promise;
    console.log("Connection successful");
    return cached.conn;
  } catch (error) {
    console.log(error);
    console.log("Not connected successfulyt");
    cached.promise = null;
    // logger.error("MongoDB connection failed:", error);
    throw new Error("Failed to connect to MongoDB");
  }
}
