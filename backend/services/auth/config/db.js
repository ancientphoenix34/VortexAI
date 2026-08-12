import mongoose from 'mongoose';
import dns from 'dns';

// Set public DNS servers to resolve MongoDB SRV records when ISP/local DNS fails
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("db connected");
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

export default connectDB;
