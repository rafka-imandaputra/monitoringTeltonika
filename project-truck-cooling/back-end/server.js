import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth.js';
import dotenv from 'dotenv';

import cors from 'cors';

// Middleware



dotenv.config(); // Memuat variabel lingkungan dari .env

const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(bodyParser.json());
// Middleware
app.use(bodyParser.json()); // Untuk mem-parsing request body dalam format JSON
app.use(express.json());
// Routes
app.use('/auth', authRoutes);

// Jalankan server
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//     console.log('USER:', process.env.USER); 
//     console.log('PASS:', process.env.APP_PASS);
//     console.log('HOST:', process.env.DB_HOST);
//     console.log('NAME:', process.env.DB_NAME);
// });
