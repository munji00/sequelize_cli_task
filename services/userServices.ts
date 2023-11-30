 const {User:userModel, userAddress:userAddressModel} = require('../models')
const jwt = require('jsonwebtoken')
const env = require('dotenv')
env.config()

interface UserIn {
  id:string,
  firstName:string,
  lastName:string,
  userName:string,
  email:string,
  password:string
}

interface UserAddInter {
  id:string,
  user_id:string,
  address:string,
  city:string,
  state:string,
  pincode:string,
  mobileNumber:string
}

const secretKey:string = process.env.SECRET_KEY || "dfuhfew76436437^$VU%V^$djd" ;

module.exports = {
    fetchUser : async(field:any) => await userModel.findOne({where:field}),
    matchPassword :(password:string , confirmPassword:string)=> password===confirmPassword,

    registerUser : async(body_data:UserIn) =>{
      const newUser:UserIn = await userModel.create(body_data);
      console.log(newUser);
      return newUser
    },

    generateToken:(obj:{email:string, userName:string}, time:string ='1h') => jwt.sign(obj, secretKey, {expiresIn:time}),

    delete_user:async(field:string) =>  await userModel.destroy({where:field}),

    dataWithPage :async(page:number) => {
    const user_data:UserIn[] = await userModel.findAll();
    const start_index:number = (page - 1)*10;
    const end_index:number = page*10;
    const sliced_data:UserIn[] = user_data.slice(start_index , end_index);
    return sliced_data;
}
}