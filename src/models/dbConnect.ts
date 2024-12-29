import mongoose, { ConnectOptions } from 'mongoose';

export const connectToDatabase = async (
  uri: string,
  options: ConnectOptions = {}
): Promise<void> => {
  try {
    const mergedOptions: ConnectOptions = { ...options };
    await mongoose.connect(uri, mergedOptions);
    console.log('Successfully connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', (error as Error).message);
    // process.exit(1); 
  }
};
