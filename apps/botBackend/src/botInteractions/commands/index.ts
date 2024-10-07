import { CustomContext } from "../../types/context";
import { Telegraf } from "telegraf";
import * as startHandler from "./start";
import * as auctionHandler from "./auction";

const commands = [startHandler, auctionHandler];

export const registerAllCommands = (bot: Telegraf<CustomContext>) => {
  commands.forEach((cmd) => {
    bot.command(cmd.name, cmd.handler);
  });
};
