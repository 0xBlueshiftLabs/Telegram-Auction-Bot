import useSWR from "swr";
import { assetSWRConfig } from "../constants/swr";

import { fetchAllBidsForUser } from "shared/graph/core/fetchers/auction";

export function useAllUserBids(
  auctionId: string,
  account: string,
  chainId: number
) {
  return useSWR(
    chainId && account && auctionId
      ? ["all-user-bids-for-auction", chainId, account, auctionId]
      : null,
    async () => {
      try {
        return await fetchAllBidsForUser(chainId, auctionId, account);
      } catch (error) {
        console.log(error);
        return [];
      }
    },
    assetSWRConfig
  );
}
