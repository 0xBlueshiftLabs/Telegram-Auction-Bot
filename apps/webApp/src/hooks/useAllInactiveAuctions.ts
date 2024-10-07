import useSWR from "swr";
import { assetSWRConfig } from "../constants/swr";

import { fetchAllInactiveAuctions } from "shared/graph/core/fetchers/auction";
import { getEasyAuctionContract } from "shared/web3/utils";
import { getProvider } from "shared/web3/getProvider";

export function useAllInactiveAuctions(account: string, chainId: number) {
  return useSWR(
    chainId && account ? ["all-inactive-auctions", chainId, account] : null,
    async () => {
      try {
        const easyAuction = getEasyAuctionContract(chainId).connect(
          getProvider(chainId) as any
        );
        const userId = await easyAuction.callStatic.getUserId(account);
        return await fetchAllInactiveAuctions(chainId, userId.toString());
      } catch (error) {
        console.log(error);
        return [];
      }
    },
    assetSWRConfig
  );
}
