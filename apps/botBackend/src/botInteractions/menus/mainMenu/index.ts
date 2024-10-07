import * as viewActiveAuctions from "./actions/1_viewActiveAuctions";
import * as viewPastAuctions from "./actions/2_viewPastAuctions";
import * as viewWalletDetails from "./actions/3_viewWalletDetails";
import * as createAuction from "./actions/4_createAuction";
import * as close from "./actions/5_close";

export const actions = [
  viewActiveAuctions,
  viewPastAuctions,
  viewWalletDetails,
  createAuction,
  close,
];
