import { S3Client } from "@aws-sdk/client-s3";
import "dotenv/config";

const droptS3Client = new S3Client({
  region: `${process.env.S3_REGION}`,
  credentials: {
    accessKeyId: `${process.env.IAM_ACCESS_KEY_ID}`,
    secretAccessKey: `${process.env.IAM_SECRET}`,
  },
});

export function disconnectS3Client() {
  droptS3Client.destroy();
}

export default droptS3Client;