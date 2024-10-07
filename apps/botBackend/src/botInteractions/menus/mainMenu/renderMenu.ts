import { ChainIds } from "shared/constants";
import { privateKeyMiddleware } from "../../../middleware/bot/privateKey";
import { CustomContext } from "../../../types/context";
import { openMenu } from "../utils";
import template from "./templates/menu";

export async function renderMainMenu(ctx: CustomContext) {
  try {
    ctx = await privateKeyMiddleware(ctx);

    await openMenu("mainMenu", template, ctx, {
      account: ctx.address,
      chainId: Number(process.env.CHAINID),
    });

    return ctx;
  } catch (error) {
    console.log(error, "err");
  }
}
