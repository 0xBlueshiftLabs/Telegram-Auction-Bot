import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { BigNumber, utils } from "ethers";
import { getAuctionInfoMinimal } from "shared/graph/core/fetchers/auction";
import { BidsWebhookQuery } from "shared/graph/core/types";
import { Telegram } from "telegraf";
import { client, tableName } from "./db";

const generateMessage = (context: BidsWebhookQuery, auctionInfo: any) =>
  `<b>🚨 Bid Placed! 🚨</b>
<a href="https://t.me/AuctionBot/WebApp?startApp=${
    context.auction
  }">Participate in the Auction</a>
Order Details:
Sell Amount : ${utils.formatUnits(
    BigNumber.from(context.sell_amount),
    auctionInfo.biddingToken.decimals
  )} ${auctionInfo.biddingToken.symbol}
Buy Amount : ${utils.formatUnits(
    BigNumber.from(context.buy_amount),
    auctionInfo.auctioningToken.decimals
  )} ${auctionInfo.auctioningToken.symbol}
Price :  ${utils.formatUnits(
    utils.parseEther(context.sell_amount).div(context.buy_amount)
  )}

Auction Info :
Cumulative Bidding Token Pledged : ${utils.formatUnits(
    BigNumber.from(auctionInfo.biddingTokenPledged),
    auctionInfo.biddingToken.decimals
  )} ${auctionInfo.biddingToken.symbol}
Auction End Date : ${new Date(
    Number(auctionInfo.auctionEndDate) * 1000
  ).toDateString()}`;

export default async function notify(
  context: BidsWebhookQuery,
  telegram: Telegram,
  chainId: number
) {
  const data = await client.send(
    new GetItemCommand({
      TableName: tableName,
      Key: {
        auctionId: {
          S: context.auction,
        },
      },
    })
  );

  const chatId = data.Item?.["chatId"];

  if (!chatId?.S) throw new Error("No subscription");

  const auctionInfo = await getAuctionInfoMinimal(chainId, context.auction);

  return telegram.sendMessage(chatId.S, generateMessage(context, auctionInfo), {
    parse_mode: "HTML",
  });
}
