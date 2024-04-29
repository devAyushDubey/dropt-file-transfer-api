import Cryptr from "cryptr";
import { generate } from "random-words";
import 'dotenv/config'

const cryptr = new Cryptr(process.env.SECRET_KEY, { saltLength: 5 });

export function cipherString(text) {
  return cryptr.encrypt(text)
}

export function decipherString(text) {
  try {
    return cryptr.decrypt(text)
  }
  catch(err){
    return null
  }
}

export function getDateString() {
  return new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
}

export function generateAlias() {
  return generate({ exactly: 1, wordsPerString: 2, maxLength: 3 ,separator: '-' });
}