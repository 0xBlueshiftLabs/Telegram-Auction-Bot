import { GetItemCommand } from '@aws-sdk/client-dynamodb';
import { client, tableName } from './db';

export default async function getAuctionNotificationDetails(auctionId:string){

    const data = await client.send(
        new GetItemCommand({
            TableName:tableName,
            Key:{
                "auctionId": {
                    S:auctionId
                }
            },
        })
    )
    
    if(!data.Item) throw new Error("No subscription info")

    return {
        chatId:data.Item?.['chatId']?.S,
        auctionId:auctionId,
    }
}