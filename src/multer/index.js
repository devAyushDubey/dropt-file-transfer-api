import multer from "multer";
import multerS3 from "multer-s3";
import droptS3Client from "../s3/index.js";
import "dotenv/config";

const storage = multerS3({
  s3: droptS3Client,
  bucket: `${process.env.S3_BUCKET}`,
  metadata: function (req, file, cb) {
    cb(null, {fieldName: file.fieldname});
  },
  key: function (req, file, cb) {
    cb(null, Date.now().toString())
  }
})

const upload = multer({ storage: storage });

export default upload;