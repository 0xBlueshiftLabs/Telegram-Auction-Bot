import { DynamoDBClient } from '@aws-sdk/client-dynamodb';


const isLambda = process.env.STAGE !=="dev";

export const client = new DynamoDBClient(isLambda?{}:{
    region: "localhost",
    endpoint:'http://localhost:5678'
})

export const tableName = process.env.TABLE_NAME!