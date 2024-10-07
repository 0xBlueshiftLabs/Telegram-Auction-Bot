import { CustomContext } from "../../../../types/context";
import { AuctionParams } from "../../../../types/params";
import { renderMainMenu } from "../../auctionMenu/renderMenu";

export const actionDisplay = "Back";
export const action = "referralBackToAuction";
export const type = "callback";
export const excludeData = ["chainId", "account"];
export const handler = async (ctx: CustomContext, params: AuctionParams) => {
  return await renderMainMenu(ctx, params.auctionId);
};
