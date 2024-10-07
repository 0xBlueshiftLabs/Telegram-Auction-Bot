import { BigInt } from "@graphprotocol/graph-ts";
import { UserReferralInfo } from "../../generated/schema";
import { BIG_INT_ZERO } from "const"

export function getUserReferralInfo(
  auctionId:BigInt,
  address:string,
  code: string
): UserReferralInfo {
  const id = auctionId.toString().concat("-").concat(address).concat("-").concat(code);
  let userReferral = UserReferralInfo.load(id);
  if (!userReferral) {
    userReferral = new UserReferralInfo(id);
    userReferral.totalRewards = BIG_INT_ZERO;
    userReferral.totalSellAmount = BIG_INT_ZERO;
    userReferral.totalWinningSellAmount = BIG_INT_ZERO;
    userReferral.totalWinningsForReferredOrders = BIG_INT_ZERO;
    userReferral.referral = code;
    userReferral.auction = auctionId.toString();
    userReferral.save();
  }
  return userReferral;
}
