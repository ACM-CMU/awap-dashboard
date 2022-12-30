import {
    DynamoDB,
    DynamoDBClientConfig,
    GetItemCommand,
    UpdateItemCommand,
    PutItemCommand,
} from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { NextApiRequest, NextApiResponse } from 'next'

const config: DynamoDBClientConfig = {
    credentials: {
        accessKeyId: process.env.S3_UPLOAD_KEY as string,
        secretAccessKey: process.env.S3_UPLOAD_SECRET as string,
    },
    region: process.env.S3_UPLOAD_REGION,
}

const client = DynamoDBDocument.from(new DynamoDB(config), {
    marshallOptions: {
        convertEmptyValues: true,
        removeUndefinedValues: true,
        convertClassInstanceToMap: true,
    },
})

export default async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        let { team, fileName } = req.body;
        let s = process.env.S3_URL_TEMPLATE;
        let s3url = s + fileName;
        const teamUser = await client.send(
            new GetItemCommand({
                TableName: process.env.NEXT_AUTH_AWS_TABLE_NAME,
                Key: {
                    TEAM_NAME: { S: team },
                },
            }),
        )
        if (!teamUser.Item) {
            client.send(
                new PutItemCommand({
                    TableName: process.env.NEXT_AUTH_AWS_TABLE_NAME,
                    Item: {
                        TEAM_NAME: { S: team },
                        BOT_FILE_NAME: { S: fileName },
                        CURRENT_SUBMISSION_URL: { S: s3url },
                        PREVIOUS_SUBMISSION_URLS: { SS: [s3url] },
                        RATING: { N: "0" },
                    },
                })
            );
        }
        else {
            const prevSubs = teamUser.Item.PREVIOUS_SUBMISSION_URLS.SS;
            if (prevSubs) {
                prevSubs.push(s3url);


                client.send(
                    new UpdateItemCommand({
                        TableName: process.env.NEXT_AUTH_AWS_TABLE_NAME,
                        Key: {
                            TEAM_NAME: { S: team },
                        },
                        UpdateExpression: "SET BOT_FILE_NAME = :fileName, CURRENT_SUBMISSION_URL = :s2, PREVIOUS_SUBMISSION_URLS = :prevSubs, RATING = :rating",
                        ExpressionAttributeValues: {
                            ':fileName': { S: fileName },
                            ':s2': { S: s3url },
                            ':rating': { N: "2" },
                            ':prevSubs': { SS: prevSubs },
                        },
                        ReturnValues: "UPDATED_NEW",
                    })

                );
            }
        }
        res.status(200).json({ s3url });

    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err });
    }
};