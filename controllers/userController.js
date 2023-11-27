
const userServices = require('../services/userServices')
const { hash_password} = require('../utility/helper')
const {userAddress, User} = require('../models')
//import { send_mail } from '../configration/emailConfigration.js';
//import { refreshTokens } from '../middleware/verifyUserReq.js'




//USER REGISTERATION CONTROLLER
const userRegister = async(req, res, next) => {

  try {
    //checking existing user
    const existingUser = await userServices.fetchUser({email:req.body.email});
    if(existingUser)
    {
        return res.status(406).send("not");
        console.log("email exists")
         //return resHandler(res,406, user_res_mess.exists);
    }

    //checking is user register with same username
    const userNameExists =await userServices.fetchUser({userName:req.body.userName})
    if(userNameExists)
    {
        return res.status(403).send("not working")
        //return resHandler(res, 403, user_res_mess.exists)
    }

    //registering user
    const newUser = await userServices.registerUser(req.body)
    /*await send_mail({
       to:req.body.email,
       link:"",
       message:'register successfully',
       subject:"regarding signup"}) */
       
    res.status(201).send({success:true, message:"registered", newUser})
       //resHandler(res, 201, {success:true, message:user_res_mess.signup, newUser})

  } catch (error) {
       console.log(error)
       return res.status(503).send(error)
       //errorHandler(res, 500, error.message);
       //next(error)
  }

}




//USER LOGIN CONTROLLER
 const  userLogin = async (req, res, next) => {
 try {
    res.status(200).send({
      success:true,
      message:"user login successfully",
      access_token:req.token,
      refresh_token:req.refresh_token
    })
 } catch (error) {
     //errorHandler(res, 501 , error.message)
     res.status(501).send({success: false, message:error.message})
 }
}




//CONTROOLER TO GET A SINGLE USER
const getUser = async(req, res, next) => {
  try {
    const user_data= await userServices.fetchUser({email:req.email});
    if(!user_data)
    {
      return res.status(401).send({message:"user not found"})
    }
    res.status(200).send({sucess:true, message:"user found successfully", user_data})
  } catch (error) {
    //res.status(500).send({success:false, message:"internal server error", error})
    next(error)
  }
}





//CONTROLLER FOR DELETE USER
const deleteUser = async(req, res, next) => {
  try {
     await userServices.delete_user({email:req.email});
     res.status(200).send({success:true, message:"user deleted successfully"})
  } catch (error) {
    //res.status(500).send({success:true, message:"internal servser error", error});
     next(error) 
  }
}




//CONTROLLER TO GETING USER WITH PAGE NO.
 const getUserWithPageNo = async(req, res, next) => {
  const {page} = req.params;
  try {
    const sliced_data = await userServices.dataWithPage(page);
    res.status(200).send({success:true, data:sliced_data})
  } catch (error) {
    next()
    //res.status(500).send({success:false, message:"internal server error", error})
  }
}




//CONTROLLER FOR CREATING ADDRESS
const createAddress = async(req, res, next) => {
  console.log("line 1" ,req.body);
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
    //res.status(500).send({success:false, message:"internal server error", error})
    next(error)
  }
}



//CONTROLLER FOR GATTING USER WITH ALL ADDRESSES
 const getUserWithAddress = async(req, res, next) => {
  const {id} = req.params;
  try {
    const user_data = await userServices.fetchUser({id:id})
    res.status(200).send({success:true, user_data})
    //resHandler(res, 200,{success:true, user_data})
  } catch (error) {
    //res.status(500).send({success:false, message:"internal server error", error});
    next(error)
  }
}



//DELETE ADDRESS
 const deleteAdd = async(req, res, next) => {
  try {
    await userAddress.deleteMany({_id : { $in : req.body.addressIds}});
    //res.status(200).send('addresses deleted successfully')
    resHandler(res, 200, "address deleted successfully")
  } catch (error) {
    //res.status(501).send('addresses deleted successfully')
    next(error)
    //errorHandler(res, 501, error.message)
  }
}


//NEW TOKEN FOR PASSWORD RESET
 const forgotPassword = async(req, res, next) => {

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
const resetPassword = async(req, res, next) => {
  try {
    if(!userServices.matchPassword(req.body.password, req.body.confirmPassword))
      return res.status(401).send({message:"pqassword and confirm password is mismatched"})
      
      const hashed_pass = await hash_password(req.body.password)
      await Users.findOneAndUpdate({email:req.user_email}, {password:hashed_pass});
      resHandler(res, 205 , user_res_mess.resetPassword)
  } catch (error) {
    next(error)
  }
}

//CONTROLLER FOR UPLOAD FILE
const uploadFile = (req, res) => {
  if(!req.file) return resHandler(res, 403, "no file selected")
  resHandler(res, 201, user_res_mess.passwordReset);
}


//GENERATE NEW TOKEN USING REFRESH TOKEN
 const newAccessToken = async(req, res) => {
   const refresh_token = req.headers.refresh_token;
   if((refresh_token in refreshTokens) && (refreshTokens[refresh_token].userName===req.body.userName))
   {
    //genrating new token
    const new_access_token = userServices.generateToken({email:req.body.email, userName:req.body.userName}, '15m')
    resHandler(res, 201, {access_token:new_access_token});
   }
   resHandler(res, 403, "resfresh token not found or refresh token not valid")
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