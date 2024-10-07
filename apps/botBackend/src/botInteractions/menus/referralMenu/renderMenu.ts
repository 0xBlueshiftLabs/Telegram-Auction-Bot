import { ChainIds } from "shared/constants";
import { CustomContext } from "../../../types/context";
import { openMenu } from "../utils";
import template from "./templates/menu";

export async function renderMainMenu(ctx: CustomContext, auctionId: string) {
  await openMenu("referralMenu", template, ctx, {
    auctionId,
    chainId: Number(process.env.CHAINID),
    account: ctx.address,
  });

  return ctx;
}
