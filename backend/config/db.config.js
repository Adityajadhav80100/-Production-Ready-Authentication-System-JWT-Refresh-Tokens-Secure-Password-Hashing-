import mongoose from "mongoose";


export  const  connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB is connected succesfully");

    } catch (error) {
        console.error('error in connecting db ' , error);
        process.exit(1);
    }
} 