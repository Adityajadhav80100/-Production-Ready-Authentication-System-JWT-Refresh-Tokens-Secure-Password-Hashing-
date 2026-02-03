import UserModel from "../models/user.model.js";

export const register = async (req , res ) => {
    try {
        
        const {email , password } = req.body ;
    
        // 1. basic validation
        if(!email || !password){
          return  res.status(400).json({message:"Email and password are required " });
        }
      
        // 2. check if user already exists
         const userExist = await UserModel.findOne({email}) ;
         if(userExist){
            return res.status(400).json({message:"User already exist " });
         }

        // 3. create user (password hashing happens in model)
         const Newuser = await UserModel.create({
              email ,
              password 
         });

         // 4. send response (NO password) 
         res.json({
            message:"user succsefully register" ,
            userId : Newuser._id ,
            email: Newuser.email
         }) ;

    } catch (error) {
  console.error("REGISTER CONTROLLER ERROR 👉", error);

  return res.status(500).json({
    message: "Internal server error",
    error: error.message
  });
}

}