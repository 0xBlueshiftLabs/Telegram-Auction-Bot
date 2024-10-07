import { CustomContext } from "../../../../types/context";
import { renderMainMenu } from "../../mainMenu/renderMenu";

export const actionDisplay = "Go Back";
export const action = "walletToMain";
export const type = "callback";
export const handler = async (ctx: CustomContext) => {
  return await renderMainMenu(ctx);
};
