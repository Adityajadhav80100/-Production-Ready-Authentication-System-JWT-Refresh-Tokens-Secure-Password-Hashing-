import "./config/env.js"; 
import app from './app.js';
import { connectDB } from './config/db.config.js';


const Port = process.env.PORT || 5000

const Startsever = async () => {
  try { 
    await connectDB() ;
    app.listen(Port, () => {
     console.log(`Example app listening on ${Port} `)
   })
  } catch (error) {
    console.error("Error in starting server  " , error);
    process.exit(1);
  }
}

Startsever();