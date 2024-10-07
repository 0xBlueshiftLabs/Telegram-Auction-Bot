import { CustomContext } from "../../types/context";
import { registerMenuActions } from "./utils";
import { actions as auctionMenuActions } from "./auctionMenu";
import { actions as mainMenuActions } from "./mainMenu";
import { actions as walletMenuActions } from "./walletMenu";
import { actions as referralMenuActions } from "./referralMenu";
import { actions as myAuctionsMenuActions } from "./myAuctionsMenu";
import { Telegraf } from "telegraf";

export const allActions = {
  mainMenu: mainMenuActions,
  auctionMenu: auctionMenuActions,
  walletMenu: walletMenuActions,
  referralMenu: referralMenuActions,
  myAuctionsMenu: myAuctionsMenuActions,
};

export default async function registerAllMenuActions(
  bot: Telegraf<CustomContext>
) {
  bot.on("callback_query", async (ctx: CustomContext) => {
    for (const value of Object.keys(allActions)) {
      //@ts-ignore
      await registerMenuActions(ctx, value, ctx.callbackQuery.data);
    }
  });
}
