import { Address } from "@graphprotocol/graph-ts";
import { ReferralReward } from "../../generated/schema";
import { BIG_INT_ZERO } from "const"

export function getReferralRewards(
  code: string,
  token: Address
): ReferralReward {
  const id = code.toString().concat("-").concat(token.toHexString())
  let referralRewards = ReferralReward.load(id);
  if (!referralRewards) {
    referralRewards = new ReferralReward(id);
    referralRewards.referral = code;
    referralRewards.token = token.toHexString();
    referralRewards.amount = BIG_INT_ZERO;
    referralRewards.save();
  }
  return referralRewards;
}
