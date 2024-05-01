import express from 'express';
import upload from '../utils/multer.js';
import File from '../models/File.js';
import { cipherString, decipherString, generateAlias } from '../utils/helper.js';
import { addAlias, aliasExists } from '../services/redis.js';

const router = express.Router();

router.post('/upload',
  verifyUploadRequest,
  upload.single('file'), 
  async (req, res) => {

    let alias = generateAlias();
    while(await aliasExists(alias)){
      alias = generateAlias();
    }

    const file = req.db.file;
    file.url = req.file.location;
    file.s3_key = req.file.key;
    file.alias = alias;
    file.uploadedOn = Date.now();
    await file.save();

    await addAlias(alias, file.id);

    res.json({
      status: 'success',
      message: "File uploaded succesfully",
      alias: alias,
      file: cipherString(file.id)
    });
  }
);

router.get('/download/:file', 
  verifyDownloadRequest, 
  async (req, res) => {
    
    const userSession = req.get('Session');
    const file = req.db.file;

    const existingUser = file.stats.accessedBy.findIndex((session)=> session.user === userSession)

    if(existingUser > -1){
      file.stats.accessedBy[existingUser].date.push(Date.now());
    }
    else{
      file.stats.accessedBy.push({
        user: userSession,
        date: [Date.now()]
      });
    }
    
    file.save();

    res.json({
      status: 'success',
      message: "File is now available for download.",
      url: req.db.file.url
    })
  }
);

router.get('/', async (req, res) => {
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

async function verifyDownloadRequest(req, res, next) {
  if(req.params.file){
    const file = await File.findById(decipherString(req.params.file));

    if(file){
      if(file.stats.allowedAccessTo.includes(req.get('Session'))){
        req.db = { file: file }
        next();
      }
      else
        res.status(403).json({ message: "[403] Forbidden: You are not allowed to access this file." });
    }
    else{
      res.status(400).json({ message: "[400] Bad Request: Invalid File ID params." });
    }
  }
  else{
    res.status(400).json({ message: "[400] Bad Request: File ID params are missing." });
  }
}