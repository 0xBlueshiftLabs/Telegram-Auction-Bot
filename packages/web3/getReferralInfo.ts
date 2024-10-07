import { BigNumber } from "ethers";
import {getReferralContract} from "./utils" 
import { getProvider } from "./getProvider"
import { fetchUserReferralInfo } from "shared/graph/core/fetchers/auction"

export const userReferralDefaultObj = {
  referralCode: null,
  ordersReferredCount: BigNumber.from("0"),
  ordersWonCount: BigNumber.from("0"),
  totalWinningSellAmount: BigNumber.from("0"),
  totalRewards: BigNumber.from("0"),
  totalSellAmount: BigNumber.from("0"),
};

export async function getReferralInfo(account:string,chainId:number,auctionId:string){
    const referralContract = getReferralContract(chainId).connect(getProvider(chainId) as any);
    let referralCode: string = await referralContract
      .addressToCode(account as string);

    if (referralCode === '') {
      return userReferralDefaultObj;
    } else {
      const referralInfo = await fetchUserReferralInfo(chainId,auctionId, referralCode);
      if(!referralInfo) return {...userReferralDefaultObj,referralCode}
      return {
        referralCode,
        ordersReferredCount: BigNumber.from(
          referralInfo.ordersReferredCount,
        ),
        ordersWonCount: BigNumber.from(referralInfo.ordersWonCount),
        totalWinningSellAmount: BigNumber.from(
          referralInfo.totalWinningSellAmount,
        ),
        totalRewards: BigNumber.from(referralInfo.totalRewards),
        totalSellAmount: BigNumber.from(referralInfo.totalSellAmount),
      };
    }

}
