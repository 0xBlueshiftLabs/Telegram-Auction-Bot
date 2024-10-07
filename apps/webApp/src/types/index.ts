import BigNumber from "bignumber.js";

export type Token = {
  symbol: string;
  address: string;
  price: BigNumber;
  balance?: string;
  totalSupply?: number;
  isWhitelisted?: boolean;
  logoURI?: string;
  decimals: number;
  chainId?: number;
  name: string;
  local?: boolean;
  feePercent?: string;
};

export interface StageProps {
  account: string;
  chainId: number;
  setStage: (args: any) => void;
  stageInfo?: {
    stageParams: any;
  };
  prevStageParams?: Record<string, any>;
}
