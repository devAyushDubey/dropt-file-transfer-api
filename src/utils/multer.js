import multer from "multer";
import multerS3 from "multer-s3";
import droptS3Client from "./s3.js";
import "dotenv/config";

const storage = multerS3({
  s3: droptS3Client,
  bucket: `${process.env.S3_BUCKET}`,
  metadata: function (req, file, cb) {
    cb(null, {fieldName: file.fieldname});
  },
  key: function (req, file, cb) {
    const originalNameArray  = file.originalname.split('.');
    if(originalNameArray < 2){
      cb(null, originalNameArray[0] + '-' + Date.now().toString());
    }
    else{
      cb(null, originalNameArray[0] + '-' + Date.now().toString()  + '.' + originalNameArray.at(-1));
    }
  }
})

const upload = multer({ storage: storage });

export default upload;