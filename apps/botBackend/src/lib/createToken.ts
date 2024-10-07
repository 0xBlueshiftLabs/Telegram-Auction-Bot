import { Wallet, ethers } from "ethers";
import ERC20_ABI from "../constants/ERC20_ABI.json";
import { tokenBytecode } from "../constants/tokenBytecode";
import { getProvider } from "shared/web3/getProvider";

async function createToken(name: string, symbol: string, supply: string,privateKey:string,chainId:number) {
  const wallet = new Wallet(privateKey, getProvider(chainId));

  const abi = ERC20_ABI;

  let factory = new ethers.ContractFactory(
    abi,
    tokenBytecode,
    wallet
  );

  let contract = await factory.deploy(
    ethers.utils.parseUnits(supply),
    name,
    18,
    symbol
  );

  console.log("Token deployed to:", contract.address);
  return {hash:contract.deployTransaction.hash,address:contract.address};
}

export default createToken;
