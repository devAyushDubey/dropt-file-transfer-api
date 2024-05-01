import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  url: String,
  alias: String,
  access: {
    type: String,
    default: 'private'
  },
  uploadedOn: Date,
  filename: String,
  filetype: String,
  size: Number,
  stats: {
    ownedBy: String,
    allowedAccessTo: [String],
    accessedBy: [
      {
        user: String,
        date: [Date],
      }
    ]
  },
  s3_key: String
})

const File = new mongoose.model('File', fileSchema);

export default File