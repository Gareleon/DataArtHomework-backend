import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    //Remove the error for strict query
    mongoose.set("strictQuery", true);
    const DB_URL = `${process.env.DB_URL_BASE}:${process.env.SECRET_KEY}${process.env.DB_HOST}`;
    await mongoose.connect(DB_URL);
    console.log("MongoDB connected successfully!");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};
