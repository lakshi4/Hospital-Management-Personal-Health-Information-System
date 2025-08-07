import express, { request, response } from "express";
import {PORT,mongoDBURL} from "./config.js";
import mongoose from "mongoose";
import adminRoutes from "./routes/adminRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import patientRoutes from './routes/patientRoutes.js';
import cors from "cors";
import innovRoutes from './routes/innovRoutes.js';
import treatmentRoutes from './routes/treatmentRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//defines an instance of the Express framework and assigns it to the variable
const app = express();

//Middleware for parsing request body
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

//Middleware for handling CORS policy
//Option 1: Allow all origins with default of cors(*)
app.use(cors());


app.get('/',(request,response)=>{
    console.log(request);
    return response.status(234).send('Welcome to mern stack')
    });

app.use('/admin', adminRoutes);
app.use('/hospitaldashboard', hospitalRoutes);
app.use('/patient', patientRoutes);
app.use('/ino', innovRoutes);
app.use('/api', treatmentRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


mongoose
.connect(mongoDBURL)
.then(()=>{
  console.log('app connected to database');
  app.listen(PORT, () => {
    console.log(`App is listning to port: ${PORT}`);
    }); 
})
.catch((error)=>{
    console.log(error);
});



