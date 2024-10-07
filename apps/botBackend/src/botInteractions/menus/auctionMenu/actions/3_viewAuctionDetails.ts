import { AuctionParams } from "../../../../types/params";
import { privateKeyMiddleware } from "../../../../middleware/bot/privateKey";
import { CustomContext } from "../../../../types/context";
import { renderMainMenu } from "../renderMenu";
import generateTemplate from "../templates/auctionDetails";
import { getAuctionInfo } from "shared/graph/core/fetchers/auction";

export const actionDisplay = "Auction Details";
export const action = "activeViewAuctionDetails";
export const type = "callback";
export const excludeData = ["account", "chainId"];
export const handler = async (
  ctx: CustomContext,
  auctionParams: AuctionParams
) => {
  try {
    const auctionInfo = await getAuctionInfo(
      Number(process.env.CHAINID),
      auctionParams.auctionId
    );

    //do validation to make sure auction exists
    await ctx.replyWithHTML(
      generateTemplate(
        auctionInfo.biddingToken.symbol,
        auctionInfo.auctioningToken.symbol,
        auctionInfo.auctionSettled
      )
    );
    await renderMainMenu(ctx, auctionParams.auctionId);
  } catch (error) {
    await ctx.reply("An error occured");
  }
};

export const middleWare = {
  before: [privateKeyMiddleware],
};
