import { privateKeyMiddleware } from "../../../../middleware/bot/privateKey";
import { CustomContext } from "../../../../types/context";
import { AuctionParams } from "../../../../types/params";
import { renderMainMenu } from "../../referralMenu/renderMenu";

export const actionDisplay = "Referrals";
export const action = "activeViewReferralInfo";
export const type = "callback";
export const excludeData = ["account", "chainId"];
export const handler = async (ctx: CustomContext, params: AuctionParams) => {
  //place bid handler
  return await renderMainMenu(ctx, params.auctionId);
};
export const middleWare = {
  before: [privateKeyMiddleware],
};
