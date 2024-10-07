import { AUCTION_ADDRESS } from "const";
import {
  BalanceIncrease,
  CodeRegistered,
  ReferralRewardManager,
  Withdraw,
} from "../../generated/ReferralRewardManager/ReferralRewardManager";
import { getReferralRewards } from "../entities/ReferralRewards";

export function onWithdraw(event: Withdraw): void {
  const auctionContract = ReferralRewardManager.bind(AUCTION_ADDRESS) 
  const referralRewards = getReferralRewards(auctionContract.addressToCode(event.params.account),event.params.token);
  referralRewards.amount = referralRewards.amount.minus(event.params.amount);
  referralRewards.save();
}

export function onBalanceIncrease(event: BalanceIncrease): void {
  const auctionContract = ReferralRewardManager.bind(AUCTION_ADDRESS) 
  const referralRewards = getReferralRewards(auctionContract.addressToCode(event.params.account),event.params.token);
  referralRewards.amount = referralRewards.amount.plus(event.params.amount);
  referralRewards.save();
}

export function onCodeRegistered(event: CodeRegistered): void {
  // getUserReferralRewards(event.params.account.toHexString(),event.params.code)
}
