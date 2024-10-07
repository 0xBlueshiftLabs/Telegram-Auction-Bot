import useSWR from 'swr';
import { assetSWRConfig } from '../constants/swr';
import { useSDK } from "@tma.js/sdk-react";

export function useNotificationDetails(auctionId:string) {


  return useSWR(
    auctionId  ? ['notification-details', auctionId] : null,
    async () => {
      try{       
        const env = process.env.NODE_ENV; 
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/auctionBotHandler/auctionNotificationDetails?auctionId=${auctionId}`,
            {
            method: "get",
            }
        );
        if(res.status!==200) throw new Error("")
        const result = await res.json();

        return {
            chatId:result.chatId as string,
            auctionId:auctionId,
        }
      }
      catch(error){
        console.log(error)
      }
    },
    assetSWRConfig,
  );

}
