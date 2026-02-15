import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String
    },
    verificationTokenExpires: {
        type: Date
    },

    resetPasswordToken: {
        type: String
    },
    resetPasswordTokenExpires: {
        type: Date
    },
    refreshToken: {
        type: String
    } ,
    role :{
        type : String ,
        enum : ["user" , "admin"],
        default : "user"
    }    

 
}, { timestamps: true });


//Pre-save Hook
UserSchema.pre("save", async function () {
    //if password is not chanaged skip hashing 
    if (!this.isModified("password")) {
        return;
    }

    //hash the password 
    this.password = await bcrypt.hash(this.password, 10);

});

//compare password 
UserSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

export default mongoose.model('User', UserSchema);