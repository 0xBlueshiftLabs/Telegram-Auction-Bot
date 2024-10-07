import { BigNumber } from "ethers";

export type Token = {
    address:string;
    name:string;
    symbol:string;
    decimals:number;
    balance:BigNumber
}

export type ChainMapping = { [chainId: number]: any };

export type TransactionParams = {
    txHash:string;
    chainId:string;
    header:string;
    subText:string;
    actionDisplay:string;
    action:string;
}