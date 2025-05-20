import mongoose from "mongoose";
import secrets from "./secrets.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(secrets.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
