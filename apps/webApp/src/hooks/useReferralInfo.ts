import useSWR from "swr";
import { assetSWRConfig } from "../constants/swr";
import {
  getReferralInfo,
  userReferralDefaultObj,
} from "shared/web3/getReferralInfo";

export function useUserReferralInfo(
  account: string,
  auctionId: string,
  chainId: number
) {
  return useSWR(
    chainId && auctionId
      ? ["current-auction-referral-info", chainId, auctionId]
      : null,
    async () => {
      try {
        return await getReferralInfo(account, chainId, auctionId);
      } catch (error) {
        console.log(error);
        return userReferralDefaultObj;
      }
    },
    assetSWRConfig
  );
}
