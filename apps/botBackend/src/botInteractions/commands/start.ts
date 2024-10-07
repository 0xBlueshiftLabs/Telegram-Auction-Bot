import { CustomContext } from "../../types/context";
import { renderMainMenu } from "../menus/mainMenu/renderMenu";

export const name = "start";

export const handler = async (ctx: CustomContext) => {
  return await renderMainMenu(ctx);
};
