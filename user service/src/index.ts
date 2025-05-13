import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './route.js';
dotenv.config();

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string, {
            dbName: "Spotify",
        });
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log(error);
    }
};

const app = express();

app.use(express.json()); //to read json values from body of request object of express

app.use("/api/v1", userRoutes);

app.get('/', (req, res) => {
    res.send('Server is working!');
});
const port = process.env.PORT || 5000;

app.listen(5000, () => {
    console.log(`Server is running on port ${port}`);
    connectDb()
});