const jwt = require('jsonwebtoken')
const env = require('dotenv').config();



const secretKey = process.env.SECRET_KEY || "dfuhfew76436437^$VU%V^$djd";


module.exports = async(req, res, next) => {
        try {
            const token = req.get("authorization").split(" ")[1];
            const decoded_data = await jwt.verify(token , secretKey);
            const curr_date = new Date();
            if(!decoded_data){
              return res.status(403).send({message:"user not found"})
            }
            else if(decoded_data.exp*1000 < curr_date.getTime())
            {
              return res.status(401).send({message:"token has expired"})

            }
            else{
              req.email=decoded_data.email,
              req.userName= decoded_data.userName
              next()
            }
        } catch (error) {
            res.status(501).send({message:error.message})
        }
}