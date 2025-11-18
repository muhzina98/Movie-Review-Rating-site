const multer = require ('multer')
const os = require('os');
const path = require('path');



const storage = multer.diskStorage({
  
  
   destination: (req, file, cb) => {
    cb(null, os.tmpdir()); 
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); 
    cb(null, Date.now() + ext); 
  }
})

const upload = multer({ storage: storage ,
  
})

module.exports = upload