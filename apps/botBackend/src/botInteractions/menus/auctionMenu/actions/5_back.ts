import { CustomContext } from "../../../../types/context";
import { renderMainMenu } from "../../mainMenu/renderMenu";

export const actionDisplay = "Go Back";
export const action = "activeAuctionToMain";
export const type = "callback";
export const excludeData = ["account", "chainId"];
export const handler = async (ctx: CustomContext) => {
  return await renderMainMenu(ctx);
};
