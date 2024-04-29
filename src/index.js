import express from "express"
import routes from "./routes/index.js";
import mongoose from "mongoose";
import "dotenv/config"

const app = express();

const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017/dropt-auth'

try{
  await mongoose.connect(mongoURL)
  console.log("Database Connected!")
}catch(err) {
  console.log(err)
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(routes)

const PORT = process.env.PORT || 3037;

app.listen(PORT , (err) => {
  if(err){
    console.log(err);
  }else{
    console.log(`App is listening to port ` + PORT);
  }
});