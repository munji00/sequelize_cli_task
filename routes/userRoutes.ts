const express = require('express')
const controllers = require('../controllers/userController.ts')
const {registerReqValidator, loginRegValidator} = require("../middleware/verifyUserReq")
const verifyUser = require("../middleware/verifyUser")
const upload = require('../configration/multerConfigration')



const userRoutes = express.Router();

userRoutes.post('/register',registerReqValidator ,controllers.userRegister)
userRoutes.post('/login',loginRegValidator, controllers.userLogin);
userRoutes.get('/get', verifyUser , controllers.getUser);
userRoutes.put('/delete' , verifyUser , controllers.deleteUser);
userRoutes.get('/list/:page' , controllers.getUserWithPageNo);
userRoutes.post('/address' , verifyUser , controllers.createAddress);
userRoutes.get('/address', verifyUser , controllers.getUserWithAddress);
userRoutes.delete('/address/:id', verifyUser, controllers.deleteAdd)
userRoutes.post('/forgot-password', controllers.forgotPassword)
userRoutes.put('/reset-forgot-password', verifyUser, controllers.resetPassword)
userRoutes.put('/upload-profile', upload.single('profile-img'), controllers.uploadFile)
userRoutes.post('/regenrate-access-token', controllers.newAccessToken)


module.exports =  userRoutes;