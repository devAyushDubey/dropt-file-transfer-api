import express from "express"
import routes from "./routes/index.js";
import mongoose from "mongoose";
import "dotenv/config"
import { disconnectRedis } from "./services/redis.js";
import { disconnectS3Client } from "./utils/s3.js";

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

const server = app.listen(PORT , (err) => {
  if(err){
    console.log(err);
  }else{
    console.log(`App is listening to port ` + PORT);
  }
});

process.on('SIGINT', async () => {

  console.log("\nGracefully shutdown initiated from SIGINT (Ctrl+C)\n");
  server.close();
  console.log("Server Closed!");
  await mongoose.disconnect();
  console.log("Database Disconnected!");
  await disconnectRedis();
  console.log("Redis Disconnected!");
  disconnectS3Client();
  console.log("S3 Client Disconnected!");
  process.exit(0);
});