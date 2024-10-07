import useSWR from "swr";
import { assetSWRConfig } from "../constants/swr";
import { useSDK } from "@tma.js/sdk-react";
import { useRouter } from "next/router";
import { utils } from "ethers";

export function useUserDetails() {
  const router = useRouter();

  const chainIdFromRouter = router.query.chainId;
  const accountFromRouter = router.query.account;

  const { components } = useSDK();

  return useSWR(
    ["fetch-user-details", chainIdFromRouter, accountFromRouter],
    async () => {
      try {
        if (
          !chainIdFromRouter ||
          !accountFromRouter ||
          isNaN(Number(chainIdFromRouter)) ||
          !utils.isAddress(accountFromRouter as string)
        ) {
          const env = process.env.NODE_ENV;
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/auctionBotHandler/getUserDetails`,
            {
              method: "post",
              body: JSON.stringify({
                initData: components?.initDataRaw as string,
                userId: components?.initData?.user?.id,
              }),
            }
          );
          if (res.status !== 200) throw new Error();
          const data = await res.json();
          const account = data.account;
          const chainId = Number(data.chainId);

          return {
            account,
            chainId,
          };
        } else {
          return {
            account: accountFromRouter,
            chainId: Number(chainIdFromRouter),
          };
        }
      } catch (error) {
        console.log(error);
        throw new Error();
      }
    },
    assetSWRConfig
  );
}
