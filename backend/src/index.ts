import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import resumeRoutes from './routes/resume.routes.js';
import { connectToDatabase } from './services/database.service.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
app.use('/api/resumes', resumeRoutes);


await connectToDatabase().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server running on http://localhost:${PORT}`);
    })
}).catch(
    (err:Error |undefined) =>{
         console.error('Database connection failed:', err);
    }
);