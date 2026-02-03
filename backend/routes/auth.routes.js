import express from 'express';
import { register } from '../controllers/auth.controller.js';

const router = express.Router();

//registe route 
router.post('/register' , register ) ;  

export default  router ;