import useSWR from 'swr';
import { assetSWRConfig } from '../constants/swr';
import { useSDK } from "@tma.js/sdk-react";


export function usePrivateKey() {
  
  
    const {components} = useSDK()

    const swrResult = useSWR(
        ['user-private-key',components?.initDataRaw],
      async () => {
            const result = await fetch(
            `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/auctionBotHandler/getPrivateKey`,
            {
                method: "post",
                body: JSON.stringify({
                initData: components?.initDataRaw as string,
                userId: components?.initData?.user?.id,
                }),
            }
            );
            if(result.status===200){
                const data = await result.json();
                return data.privateKey
            }
            throw new Error()
      },
      assetSWRConfig,
    );
  
    return swrResult;
  }
  