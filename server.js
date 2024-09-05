import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

app.use(cors({
    origin: "https://user-auth-frontend-ruby.vercel.app",
    credentials: true
}));

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDb");
    } catch (error) {
        console.error(error.message);
    }
};

app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/api/user", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    await connect();
    console.log(`Server is running on port ${PORT}`)
});