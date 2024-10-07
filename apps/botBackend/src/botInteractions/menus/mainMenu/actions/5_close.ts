import { CustomContext } from "../../../../types/context";

export const actionDisplay = "Close";
export const action = "closeMainMenu";
export const type = "callback";
export const excludeData = true;

export const handler = async (ctx: CustomContext) => {
  return await ctx.editMessageReplyMarkup(undefined);
};
