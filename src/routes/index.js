import express from 'express';
import upload from '../multer/index.js';
import File from '../models/File.js';
import { cipherString, decipherString } from '../utils/helper.js';

const router = express.Router();

router.post('/upload',
  verifyUploadRequest,
  upload.single('file'), 
  async (req, res) => {
    const file = req.db.file;
    file.url = req.file.location;
    await file.save();
    res.json({ 
      status: 'success',
      message: "File uploaded succesfully",
      alias: '',
      file: cipherString(file.id)
    });
  }
);

router.get('/', (req, res) => {
  res.send('Dropt File Transfer API');
});


export default router;

async function verifyUploadRequest(req, res, next) {
  if(req.query.file){
    const file = await File.findById(decipherString(req.query.file));

    if(file){
      req.db = { file: file }
      next()
    }
    else{
      res.status(400).json({ message: "[400] Bad Request: Invalid File ID query params." });
    }
  }
  else{
    res.status(400).json({ message: "[400] Bad Request: File ID query params are missing." });
  }
}