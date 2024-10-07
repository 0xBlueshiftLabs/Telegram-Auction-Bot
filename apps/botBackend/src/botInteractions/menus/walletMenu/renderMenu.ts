import { getProvider } from "shared/web3/getProvider";
import { CustomContext } from "../../../types/context";
import { openMenu } from "../utils";
import generateTemplate from "./templates/menu";
import { ChainIds } from "shared/constants";
import { BigNumber, utils } from "ethers";

export async function renderWalletMenu(ctx: CustomContext) {
  let ethBalance = BigNumber.from("0");
  const provider = getProvider(Number(process.env.CHAINID));
  if (provider) {
    ethBalance = await provider.getBalance(ctx?.address as string);
  }
  await openMenu(
    "walletMenu",
    generateTemplate(ctx.address as string, utils.formatEther(ethBalance)),
    ctx
  );

  return ctx;
}
