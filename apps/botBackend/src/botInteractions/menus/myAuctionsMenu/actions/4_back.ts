import { CustomContext } from "../../../../types/context";
import { renderMainMenu } from "../../mainMenu/renderMenu";

export const actionDisplay = "Go Back";
export const action = "matm"; // myAuctionsToMain
export const type = "callback";
export const excludeData = true;
export const handler = async (ctx: CustomContext) => {
  return await renderMainMenu(ctx);
};
