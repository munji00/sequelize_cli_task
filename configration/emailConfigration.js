"use strict";
const nodemailer = require('nodemailer')
const env = require('dotenv');
const {google} = require('googleapis')

env.config();

const OAuth2 = google.auth.OAuth2;
const OAuth2_client = new OAuth2(process.env.G_CLIENT_ID, process.env.G_CLIENT_SECRET)
OAuth2_client.setCredentials({refresh_token:process.env.G_REFRESH_TOKEN})

module.exports = (data) => {
  const access_token = OAuth2_client.getAccessToken();

  const transport = nodemailer.createTransport({
    service:'gmail',
    auth:{
      type:'OAuth2',
      user:"mohdumairsiddiqui00@gmail.com",
      clientId:process.env.G_CLIENT_ID,
      clientSecret:process.env.G_CLIENT_SECRET,
      refreshToken:process.env.G_REFRESH_TOKEN,
      accessToken:access_token

    }
  })

  const mail_options = {
    from: "mohdumairsiddiqui00@gmail.com",
    to:data.to,
    subject:data.subject,
    text: data.message,
    html:`<b><h2>${data.message}</h></b>
          <a href=${data.url}>${data.link}</a>`,
  }

  transport.sendMail(mail_options , (err, result)=>{
    if(err) console.log(err)
    else console.log(result)

    transport.close();
  })
}
