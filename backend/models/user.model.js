import mongoose from "mongoose";
import bcrypt from "bcryptjs" ;

const  UserSchema = new mongoose.Schema({
    email :{
        type : String ,
        required : true ,
        unique: true ,
        trim: true ,
        lowercase: true 
    } ,
    password: {
        type : String ,
        required : true ,
    } ,
    isVerified :{
        type: Boolean ,
        default:false 
    } ,
   
} , { timestamps : true});


//Pre-save Hook
UserSchema.pre("save" , async function (next) {
     //if password is not chanaged skip hashing 
     if(!this.isModified("password")){
        return ;
     } 

     //hash the password 
     this.password = await bcrypt.hash(this.password, 10);
     
});

export default mongoose.model('User' , UserSchema);