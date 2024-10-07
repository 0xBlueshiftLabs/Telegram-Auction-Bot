import { privateKeyMiddleware } from "../../../../middleware/bot/privateKey";
import { CustomContext } from "../../../../types/context";
import { renderWalletMenu } from "../../walletMenu/renderMenu";

export const actionDisplay = "View Wallet";
export const action = "viewWallet";
export const type = "callback";
export const excludeData = true;
export const handler = async (ctx: CustomContext) => {
  return await renderWalletMenu(ctx);
};

export const middleWare = {
  before: [privateKeyMiddleware],
};
