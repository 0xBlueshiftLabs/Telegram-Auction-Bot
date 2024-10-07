import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { SellOrder } from "../../generated/schema";
import { BIG_INT_ZERO } from "const";

export function getSellOrder(
  auctionID: BigInt,
  userId: BigInt,
  buyAmount: BigInt,
  sellAmount: BigInt,
  referralCode: string | null,
  block: ethereum.Block | null
): SellOrder {
  const orderId =auctionID.toString().concat("-").concat(userId
    .toString())
    .concat("-")
    .concat(buyAmount.toString().concat("-"))
    .concat(sellAmount.toString());
  let newSellOrder = SellOrder.load(orderId);
  if (!newSellOrder) {
    newSellOrder = new SellOrder(orderId);
    newSellOrder.buyAmount = buyAmount;
    newSellOrder.sellAmount = sellAmount;
    newSellOrder.auction = auctionID.toString();
    newSellOrder.orderClaimed = false;
    newSellOrder.cancelled = false;
    newSellOrder.auctionUser = userId.toString();
    newSellOrder.referral = referralCode;
    newSellOrder.winningAmount = BIG_INT_ZERO;

    newSellOrder.timestamp = BIG_INT_ZERO;
    newSellOrder.block = BIG_INT_ZERO;
    newSellOrder.save();
  }
  if (block) {
    newSellOrder.timestamp = block.timestamp;
    newSellOrder.block = block.number;
    newSellOrder.save();
  }
  return newSellOrder;
}