import { privateKeyMiddleware } from "../../../../middleware/bot/privateKey";
import { CustomContext } from "../../../../types/context";
import { renderWalletMenu } from "../renderMenu";

export const actionDisplay = "Show Private Key";
export const action = "exposePrivateKey";
export const handler = async (ctx: CustomContext) => {
  return await ctx.replyWithHTML(`
        <b>Please delete your private key after copying it!!</b>
        <pre>${ctx.privateKey}</pre>
    `);
};
export const type = "callback";

export const middleWare = {
  before: [privateKeyMiddleware],
  after: [renderWalletMenu],
};
