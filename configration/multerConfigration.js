const multer = require("multer");
const {v4} = require('uuid')

const rand_id = v4();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${rand_id}.jpg`
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage })
module.exports = upload