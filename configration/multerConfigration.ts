const multer = require("multer");
const {v4} = require('uuid')

const rand_id:string = v4();

const storage = multer.diskStorage({
  destination: function (req:any, file:any, cb:any) {
    cb(null, './uploads')
  },
  filename: function (req:any, file:any, cb:any) {
    const uniqueSuffix:string = `${rand_id}.jpg`
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage })
module.exports = upload