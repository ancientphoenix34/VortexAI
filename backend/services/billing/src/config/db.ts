import mongoose from 'mongoose';
import dns from 'dns';

// Set public DNS servers to resolve MongoDB SRV records when ISP/local DNS fails
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not defined.');
    }
    await mongoose.connect(mongoUri);
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
  }
};

export default connectDB;
