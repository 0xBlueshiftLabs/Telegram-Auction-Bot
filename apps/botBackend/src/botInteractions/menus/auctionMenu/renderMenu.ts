import { ChainIds } from "shared/constants";
import { CustomContext } from "../../../types/context";
import { openMenu } from "../utils";
import generateTemplate from "./templates/menu";

export async function renderMainMenu(ctx: CustomContext, auctionId: string) {
  //validate that an active auction with this id exists
  await openMenu("auctionMenu", generateTemplate(auctionId), ctx, {
    auctionId,
    account: ctx.address,
    chainId: Number(process.env.CHAINID),
  });

  return ctx;
}
