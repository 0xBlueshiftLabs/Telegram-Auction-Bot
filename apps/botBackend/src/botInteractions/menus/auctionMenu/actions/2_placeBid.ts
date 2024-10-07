import { privateKeyMiddleware } from "../../../../middleware/bot/privateKey";

export const actionDisplay = "Place Bid";
export const action = "activePlaceBid";
export const type = "webapp";
export const url = `${process.env.WEB_URL}/webApp/PlaceBid`;
export const middleWare = {
  before: [privateKeyMiddleware],
};
