import mongoose from "mongoose";

const sessionsSchema = new mongoose.Schema({
  sessionId: String,
  date: String
})

const userSchema = new mongoose.Schema({
  name: String,
  picture: String,
  username: String,
  email: String,
  googleId: String,
  password: String,
  tier: {
    type: String,
    default: 'free'
  },
  verified: Boolean,
  sessions: [sessionsSchema]
}, { timestamps: true })

const fileSchema = new mongoose.Schema({
  url: String,
  filename: String,
  filetype: String,
  size: Number,
  ownedBy: String
})

const User = new mongoose.model('User', userSchema);
const File = new mongoose.model('File', fileSchema);

export default File