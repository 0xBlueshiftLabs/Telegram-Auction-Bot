import { UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { client, tableName } from './db';
import { getAuctionData } from "shared/web3/getAuctionData"
import { getProvider } from "shared/web3/getProvider"  
import { getUserID } from 'shared/web3/getUserID';
import { Telegram } from 'telegraf';

export default async function registerAuctionNotifications(auctionId:string,chatId:string,address:string,chainId:number,telegram:Telegram,tgUserID:string){
    const provider = getProvider(chainId);
    if(!provider) throw new Error("Provider not available");

    const {initialAuctionOrder:{auctionUser},auctionEndDate} = await getAuctionData(auctionId,chainId,provider);

    const userId = await getUserID(address,chainId,provider);

    const admins  = await telegram.getChatAdministrators(chatId);


    let flag = false
    for(const admin of admins){
        if(admin.user.id.toString() === tgUserID.toString()){
            flag=true
        }
    }

    if(!flag) throw new Error("Only group admins can subscribe to notifications")
    if(auctionUser!==userId) throw new Error("Only auction creator can subscribe to notifications"); 
    if(auctionEndDate<=Date.now()/1000) throw new Error("Cannot subscribe to expired auctions")

    await client.send(
        new UpdateItemCommand({
            TableName:tableName,
            Key:{
                "auctionId": {
                    S:auctionId
                }
            },
            AttributeUpdates: {
              "chatId": { 
                Value: {
                    S:chatId
                },
                Action: "PUT",
              },
            },
        })
    )
}
