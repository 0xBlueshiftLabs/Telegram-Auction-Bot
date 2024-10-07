import { DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import { client, tableName } from './db';
import { getAuctionData } from "shared/web3/getAuctionData"
import { getProvider } from "shared/web3/getProvider"  
import { getUserID } from 'shared/web3/getUserID';

export default async function cancelAuctionNotifications(auctionId:string,address:string,chainId:number){

    const provider = getProvider(chainId);
    if(!provider) throw new Error("Provider not available");

    const {initialAuctionOrder:{auctionUser}} = await getAuctionData(auctionId,chainId,provider);

    const userId = await getUserID(address,chainId,provider);

    if(auctionUser!==userId) throw new Error("Only auction creator can edit their notifications"); 

    await client.send(
        new DeleteItemCommand({
            TableName:tableName,
            Key:{
                "auctionId": {
                    S:auctionId
                }
            }
        })
    )
}
