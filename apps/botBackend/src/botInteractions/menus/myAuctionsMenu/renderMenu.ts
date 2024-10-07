import { privateKeyMiddleware } from "../../../middleware/bot/privateKey";
import { CustomContext } from "../../../types/context";
import { openMenu } from "../utils";
import template from "./templates/menu";

export async function renderMainMenu(ctx: CustomContext) {
  await openMenu("myAuctionsMenu", template, ctx, {
    account: ctx.address,
    chainId: Number(process.env.CHAINID!),
  });

  return ctx;
}
