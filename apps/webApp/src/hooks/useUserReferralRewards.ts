import useSWR from "swr";
import { assetSWRConfig } from "../constants/swr";
import { BigNumber } from "ethers";
import { fetchUserReferralReward } from "shared/graph/core/fetchers/auction";

export function useAuctionReferralRewards(
  code: string | null | undefined,
  chainId?: number,
  token?: string
) {
  return useSWR(
    chainId && token && code && code !== null
      ? ["reward-for-auction", chainId, token, code]
      : null,
    async () => {
      try {
        if (!code || !token) throw new Error();
        return await fetchUserReferralReward(chainId, code, token);
      } catch (error) {
        console.log(error);
        return BigNumber.from("0");
      }
    },
    assetSWRConfig
  );
}
