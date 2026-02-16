import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.routes.js'
import cookieParser from 'cookie-parser';
import helmet from "helmet";
import rateLimit from "express-rate-limit";


// Initialize Express app 
const app = express();

//global middlewares
app.use(cors());
app.use(helmet());


app.use(express.json());

app.use(cookieParser()); 

//authRoute
app.use('/api/auth' , authRouter);

//limiter for security
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100 // 100 requests per IP
});

app.use(limiter);



//testing route
app.get('/', (req, res) => {
  res.send('Creating appllication for my Production ready Project ')
})

export default app;