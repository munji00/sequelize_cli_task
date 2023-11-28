const randomToken = require('rand-token')
const userServices = require('../services/userServices')
const {client} = require('../configration/redisConfigration')
const {hash_password, compare_password } = require('../utility/helper')


 let refreshTokens = {}


const registerReqValidator = async(req, res, next) => {
  
  if(!userServices.matchPassword(req.body.password, req.body.confirmPassword))
       return res.status(401).send({message:"password mismatch"});
       const hashed_pass =  await hash_password(req.body.password);
       req.body.password = hashed_pass;
       next();
}

const loginRegValidator = async(req, res, next) => {

  const existingUser = await userServices.fetchUser({email:req.body.email});
  if(!existingUser)
      return res.status(404).send({message:"user not found"});
   
  
    if(!await compare_password(req.body.password, existingUser.password))
       return res.status(203).send({message:"email or password is incorrect"});

   const genrated_token = userServices.generateToken({email:req.body.email, userName:existingUser.userName})
   const refreshToken = randomToken.uid(256);
        await client.hSet(refreshToken, {
          email:req.body.email,
          userName:existingUser.userName
         })
   res.cookie('refreshToken', refreshToken, {
       httpOnly:true,
       secure: true
      });
   req.token=  genrated_token;
   req.user=existingUser; 
      
  next()    

}

module.exports = {
  registerReqValidator, 
  loginRegValidator,
  refreshTokens
}