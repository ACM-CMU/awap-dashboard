import {
  DynamoDB,
  DynamoDBClientConfig,
  GetItemCommand,
  PointInTimeRecoveryDescriptionFilterSensitiveLog,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import fs from "fs";
import AWS from "aws-sdk";
import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from 'next'
import { hash } from 'bcrypt'
import { defaultModifiers } from '@popperjs/core/lib/popper-lite';
import { typescript } from 'next.config';

const s3 = new AWS.S3({
  region: process.env.S3_UPLOAD_REGION,
  accessKeyId: process.env.S3_UPLOAD_KEY,
  secretAccessKey: process.env.S3_UPLOAD_SECRET,
  signatureVersion: "v4",
});

// const config: DynamoDBClientConfig = {
//   credentials: {
//     accessKeyId: process.env.NEXT_AUTH_AWS_ACCESS_KEY as string,
//     secretAccessKey: process.env.NEXT_AUTH_AWS_SECRET_KEY as string,
//   },
//   region: process.env.NEXT_AUTH_AWS_REGION,
// }

// const client = DynamoDBDocument.from(new DynamoDB(config), {
//   marshallOptions: {
//     convertEmptyValues: true,
//     removeUndefinedValues: true,
//     convertClassInstanceToMap: true,
//   },
// })


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
    res.status(200).json({url});
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
};
  // try {
  //   let {name, type} = req.body;
    
  //   const params = {
  //     Bucket: "awap23-bots",
  //     Key: name,
  //     Body: req.
  //   }
  //   s3.upload(params, function(err, data) {
  //     if (err) {
  //       throw err;
  //     }
  //     console.log(`File uploaded successfully. ${data.Location}`);
  //   }
  //   );



  
  // console.error("hert");
  // const form = formidable();
  // form.parse(req, (err, fields, files) => {
  //   if(!files.demo){

  //     res.status(400).send("No file uploaded");
  //     return;
  //   }
  //   console.log("file uploaded");
  //   try{
  //     // Setting up S3 upload parameters
  //     const params = {
  //       Bucket: "awap23-bots",
  //       Key:"random1", // File name you want to save as in S3
  //       Body: "body1"
  //     };
  //     res.status(201).send("file uploaded");
  //     // Uploading files to the bucket
  //     return s3.upload(params, function(err, data) {
  //         if (err) {
  //             throw err;
  //         }
  //         console.log(`File uploaded successfully. ${data.Location}`);
  //     });
  //   }
  //   catch(err){
  //     console.log(err);
  //     res.status(500).send("error uploading file");
  //   }
  // }
  // );
  
  // const fileContent = fs.readFileSync(fileName);

  
  // client.send(
  //   new PutItemCommand({
  //     TableName: process.env.NEXT_AUTH_AWS_TABLE_NAME,
  //     Item: {
  //       TEAM_NAME: { S: "awap_test_team7" },
  //       BOT_FILE_NAME: { S: "test2"},
  //       CURRENT_SUBMISSION_URL: { S: "sample_url" }
  //     },
  //   })
  // );

  // const form = formidable();
  // form.parse(req, (err, fields, files) => {
    // client.send(
    //   new PutItemCommand({
    //     TableName: process.env.NEXT_AUTH_AWS_TABLE_NAME,
    //     Item: {
    //       TEAM_NAME: { S: "awap_test_team2" },
    //       BOT_FILE_NAME: { S: "hello"},
    //       CURRENT_SUBMISSION_URL: { S: "sample_url" }
    //     },
    //   })
    // );
  // });

// }
  

    
  
//   //res.status(201).send("File uploaded");
  
// }
// export default async function handler(
//   req,
//   res
// ) {
//   //const fileContent = fs.readFileSync(fileName);

//   // Setting up S3 upload parameters
//   const params = {
//       Bucket: "awap23-bots",
//       Key: 'uploads/bot.jpg', // File name you want to save as in S3
//       Body: "hello"
//   };

//   // Uploading files to the bucket
//   s3.upload(params, function(err, data) {
//       if (err) {
//           throw err;
//       }
//       console.log(`File uploaded successfully. ${data.Location}`);
//   });
// };
