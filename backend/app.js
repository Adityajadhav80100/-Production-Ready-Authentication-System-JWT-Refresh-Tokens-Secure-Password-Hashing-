import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.routes.js'
import cookieParser from 'cookie-parser';
// Initialize Express app 
const app = express();

//global middlewares
app.use(cors());
app.use(express.json());

app.use(cookieParser()); 

//authRoute
app.use('/api/auth' , authRouter)

//testing route
app.get('/', (req, res) => {
  res.send('Creating appllication for my Production ready Project ')
})

export default app;