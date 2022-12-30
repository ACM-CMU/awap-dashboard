import AWS from "aws-sdk";
import { NextApiRequest, NextApiResponse } from 'next'


const s3 = new AWS.S3({
  region: process.env.S3_UPLOAD_REGION,
  accessKeyId: process.env.S3_UPLOAD_KEY,
  secretAccessKey: process.env.S3_UPLOAD_SECRET,
  signatureVersion: "v4",
});

export default async (req: NextApiRequest, res: NextApiResponse) => {

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    let { name, type } = req.body;
    const fileParams = {
      Bucket: process.env.S3_UPLOAD_BUCKET,
      Key: name,
      ContentType: type,
    };

    const url = await s3.getSignedUrlPromise("putObject", fileParams);
    res.status(200).json({ url });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
};
