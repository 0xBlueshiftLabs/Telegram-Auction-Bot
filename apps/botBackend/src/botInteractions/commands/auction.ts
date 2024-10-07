import { NarrowedContext } from "telegraf";
import { CommandContextExtn, CustomContext } from "../../types/context";
import { renderMainMenu } from "../menus/auctionMenu/renderMenu";
import * as tt from "telegraf/typings/telegram-types";
import { privateKeyMiddleware } from "../../middleware/bot/privateKey";

export const name = "auction";

type CtxType = NarrowedContext<CustomContext, tt.MountMap["text"]> &
  CommandContextExtn;

export const handler = async (ctx: CtxType) => {
  try {
    if (!ctx.message.text) return ctx.reply("Invalid command");
    const auctionId = ctx.args?.[0];
    if (!auctionId) return ctx.reply("Invalid command");
    ctx = (await privateKeyMiddleware(ctx)) as CtxType;
    return await renderMainMenu(ctx, auctionId);
  } catch (error) {
    console.log(error);
  }
};
