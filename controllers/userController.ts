
const userServices = require('../services/userServices')
const { hash_password} = require('../utility/helper')
const {userAddress, User} = require('../models')
const {client} = require('../configration/redisConfigration')
const send_mail = require('../configration/emailConfigration')



interface UserIn {
  id:string,
  firstName:string,
  lastName:string,
  userName:string,
  email:string,
  password:string
}

//USER REGISTERATION CONTROLLER
const userRegister = async(req:any, res:any, next:any) => {
  try {
    //checking existing user
    const existingUser:UserIn = await userServices.fetchUser({email:req.body.email});
    if(existingUser) return res.status(406).send("user already registered");

    //checking is user register with same username
    const userNameExists:UserIn = await userServices.fetchUser({userName:req.body.userName})
    if(userNameExists) return res.status(403).send("No user with this user name")

    //registering user
    const newUser:UserIn = await userServices.registerUser(req.body)
       /*await send_mail({
       to:req.body.email,
       link:"",
       message:'register successfully',
       subject:"regarding signup"}) */
       
    res.status(201).send({success:true, message:"registered", newUser})
  } catch (error) {
       console.log(error)
       return res.status(503).send(error)
  }
}




//USER LOGIN CONTROLLER
 const  userLogin = async (req:any, res:any, next:any) => {
 try {
    res.status(200).send({
      success:true,
      message:"user login successfully",
      access_token:req.token,
    })
 } catch (error:any) {
     res.status(501).send({success: false, message:error.message})
 }
}




//CONTROOLER TO GET A SINGLE USER
const getUser = async(req:any, res:any, next:any) => {
  try {
    const user_data= await userServices.fetchUser({email:req.email});
    if(!user_data)
    {
      return res.status(401).send({message:"user not found"})
    }
    res.status(200).send({sucess:true, message:"user found successfully", user_data})
  } catch (error) {
    next(error)
  }
}





//CONTROLLER FOR DELETE USER
const deleteUser = async(req:any, res:any, next:any) => {
  try {
     await userServices.delete_user({email:req.email});
     res.status(200).send({success:true, message:"user deleted successfully"})
  } catch (error) {
     next(error) 
  }
}




//CONTROLLER TO GETING USER WITH PAGE NO.
 const getUserWithPageNo = async(req:any, res:any, next:any) => {
  const {page} = req.params;
  try {
    const sliced_data = await userServices.dataWithPage(page);
    res.status(200).send({success:true, data:sliced_data})
  } catch (error) {
    next()
  }
}




//CONTROLLER FOR CREATING ADDRESS
const createAddress = async(req:any, res:any, next:any) => {
  const {address, city, state, pincode , mobileNumber} = req.body;
  try {
     const user_data= await userServices.fetchUser({email:req.email});
     console.log(user_data)
     if(user_data==null)
     {
      return res.status(403).send({message:"user not found"})
     }
     const newAddress =await userAddress.create({user_id:user_data.id, address, city, state, pincode, mobileNumber})
     console.log(newAddress);
     res.status(201).send({success:true, message:"address created successfully", newAddress})
  } catch (error) {
    console.log(error);
    next(error)
  }
}



//CONTROLLER FOR GATTING USER WITH ALL ADDRESSES
 const getUserWithAddress = async(req:any, res:any, next:any) => {
  const {id} = req.params;
  try {
    const user_data = await User.findOne({include:userAddress},{where:{id:id}})
    res.status(200).send({success:true, user_data})
  } catch (error) {
    next(error)
  }
}



//DELETE ADDRESS
 const deleteAdd = async(req:any, res:any, next:any) => {
  try {
    await userAddress.destroy({id : req.body.addressIds});
    res.status(200).send({message:"address deleted successfully"})
  } catch (error) {
    next(error)
  }
}


//NEW TOKEN FOR PASSWORD RESET
 const forgotPassword = async(req:any, res:any, next:any) => {

  try {
    const existingUser = await userServices.fetchUser({email:req.body.email})
    if(!existingUser) return res.status(403).send({message:"user not found"})
    const newToken = userServices.generateToken({email:req.body.email}, '15m')
    res.status(201).send({message:"new token genrated successfully", token:newToken})
  } catch (error) {
    next(error)
  }
}


//PASSWORD RESET
const resetPassword = async(req:any, res:any, next:any) => {
  try {
    if(!userServices.matchPassword(req.body.password, req.body.confirmPassword))
      return res.status(401).send({message:"password and confirm password is mismatched"})
      
      const hashed_pass:string = await hash_password(req.body.password)
      await User.findOneAndUpdate({email:req.user_email}, {password:hashed_pass});
      res.status(205).send("password reset successfully")
  } catch (error) {
    next(error)
  }
}



//CONTROLLER FOR UPLOAD FILE
const uploadFile = (req:any, res:any) => {
  if(!req.file) return res.status(403).send({message:"no file selected"})
  res.status(201).send({success:true, message:"profile upload successfully"})
}




//GENERATE NEW TOKEN USING REFRESH TOKEN
 const newAccessToken = async(req:any, res:any, next:any) => {
   const refresh_token:string = req.headers.refresh_token;
   try {
     const refresh_token_data:{email:string, userName:string} = await client.hGetAll(refresh_token);
     if((refresh_token_data) && (refresh_token_data.userName===req.body.userName))
     {
       //genrating new token
         const new_access_token:string = userServices.generateToken({email:req.body.email, userName:req.body.userName}, '15m')
        await client.del(refresh_token);
        return res.status(200).send({success:true, access_token:new_access_token})
     }
     
     res.status(403).send("refresh token not found or refresh token not valid")
   } catch (error) {
     next(error);
   }
  
}

module.exports = {
  userRegister,
  userLogin,
  getUser,
  deleteUser,
  forgotPassword,
  resetPassword,
  uploadFile,
  newAccessToken,
  getUserWithPageNo,
  getUserWithAddress,
  createAddress,
  deleteAdd
}