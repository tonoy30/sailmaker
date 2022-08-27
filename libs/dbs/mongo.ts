import mongoose from 'mongoose';

export const connectWithMongoDB = (connectionString: string) => {
  mongoose
    .connect(connectionString)
    .then(() => console.log('Service Connected to MongoDB'))
    .catch((e) => console.log(e));
};
