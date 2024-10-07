import useSWR from "swr";
import { assetSWRConfig } from "../constants/swr";

import { fetchUserCreatedAuctions } from "shared/graph/core/fetchers/auction";

export function useMyAuctions(account: string, chainId: number) {
  return useSWR(
    account && chainId ? ["my-auctions", chainId, account] : null,
    async () => {
      try {
        return await fetchUserCreatedAuctions(chainId, account);
      } catch (error) {
        console.log(error);
        return [];
      }
    },
    assetSWRConfig
  );
}
