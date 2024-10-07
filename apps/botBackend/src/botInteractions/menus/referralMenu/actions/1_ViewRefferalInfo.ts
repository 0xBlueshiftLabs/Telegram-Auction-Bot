import { CustomContext } from "../../../../types/context";
import { AuctionParams } from "../../../../types/params";
import { renderMainMenu } from "../renderMenu";
import { getReferralInfo } from "shared/web3/getReferralInfo";
import generateTemplate from "../templates/referralInfo";
import { ChainIds } from "shared/constants";
import { getAuctionInfo } from "shared/graph/core/fetchers/auction";
import { utils } from "ethers";
import { privateKeyMiddleware } from "../../../../middleware/bot/privateKey";

export const actionDisplay = "Referral Info";
export const action = "viewReferralInfo";
export const type = "callback";
export const excludeData = ["chainId", "account"];
export const handler = async (ctx: CustomContext, params: AuctionParams) => {
  try {
    const referralInfo = await getReferralInfo(
      ctx.address as string,
      Number(process.env.CHAINID),
      params.auctionId
    );
    const auctionInfo = await getAuctionInfo(
      Number(process.env.CHAINID),
      params.auctionId
    );

    const ordersWon = referralInfo.ordersWonCount.toString();
    const ordersReferred = referralInfo.ordersReferredCount.toString();
    const referralCode = referralInfo.referralCode;
    const totalRewardsEarned = `${utils.formatUnits(
      referralInfo.totalRewards,
      auctionInfo.biddingToken.decimals
    )} ${auctionInfo.biddingToken.symbol}`;

    await ctx.replyWithHTML(
      generateTemplate(
        ordersWon,
        ordersReferred,
        referralCode,
        totalRewardsEarned
      )
    );

    return await renderMainMenu(ctx, params.auctionId);
  } catch (error) {
    console.log(error);
    return ctx.reply(
      "An error occured while processing your request, please reach out to the mod team"
    );
  }
};

export const middleWare = {
  before: [privateKeyMiddleware],
};
