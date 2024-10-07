import { privateKeyMiddleware } from "../../../../middleware/bot/privateKey";
import { CustomContext } from "../../../../types/context";
import { renderMainMenu } from "../../myAuctionsMenu/renderMenu";

export const actionDisplay = "Create Auction/Token";
export const action = "openCreateAuctionMenu";
export const type = "callback";
export const excludeData = true;
export const handler = async (ctx: CustomContext) => {
  return await renderMainMenu(ctx);
};

export const middleWare = {
  before: [privateKeyMiddleware],
};
