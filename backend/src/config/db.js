import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://nbisht6791_db_user:AZLv1MxrcpQLKEo5@cluster0.ltkvtea.mongodb.net/?appName=Cluster0');
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("DB Error:", error);
    process.exit(1);
  }
};

export default connectDB;
