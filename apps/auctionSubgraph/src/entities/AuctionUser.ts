import { Address, BigInt } from "@graphprotocol/graph-ts";
import { AuctionUser } from "../../generated/schema";
import {ReferralRewardManager} from "../../generated/ReferralRewardManager/ReferralRewardManager"
import { REFERRAL_ADDRESS } from "const";

export function getAuctionUser(
  userId: BigInt,
  userAddress: string
): AuctionUser {
  const id = userId.toString();
  let auctionUser = AuctionUser.load(id);
  if (!auctionUser) {
    const referralContract = ReferralRewardManager.bind(REFERRAL_ADDRESS)
    auctionUser = new AuctionUser(id);
    let addy = Address.fromString(userAddress)
    auctionUser.address = addy;
    let code = referralContract.addressToCode(addy)
    if(code!==""){
      auctionUser.referral = code;
    }
    auctionUser.save();
  }

  return auctionUser;
}