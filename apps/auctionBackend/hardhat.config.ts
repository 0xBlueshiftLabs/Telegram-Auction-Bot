import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "hardhat-deploy";
import dotenv from "dotenv";
import { utils } from "ethers";
import type { HttpNetworkUserConfig } from "hardhat/types";
import yargs from "yargs";
import "hardhat-contract-sizer";
import "@nomiclabs/hardhat-ethers";

import { clearAuction } from "./src/tasks/clear_auction";
import { clearAuctionSimplified } from "./src/tasks/clear_auction_simplifed";
import { initiateAuction } from "./src/tasks/initiate_new_auction";
import { placeManyOrders } from "./src/tasks/placeManyOrders";
import { createVestingStrategy } from "./src/tasks/create_vesting_strategy";
import { createTestToken } from "./src/tasks/create_new_test_token";
import jsonEnv from "../../config/config.dev.json";

const argv = yargs
  .option("network", {
    type: "string",
    default: "hardhat",
  })
  .help(false)
  .version(false).argv;

// Load environment variables.
dotenv.config();
const {
  GAS_PRICE_GWEI,
  ALCHEMY_API_KEY,
  MNEMONIC,
  MY_ETHERSCAN_API_KEY,
} = process.env;

const DEFAULT_MNEMONIC =
  "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat";

const sharedNetworkConfig: HttpNetworkUserConfig = {};

const PK = jsonEnv.PRIVATE_KEY;

if (PK) {
  sharedNetworkConfig.accounts = [PK];
} else {
  sharedNetworkConfig.accounts = {
    mnemonic: MNEMONIC || DEFAULT_MNEMONIC,
  };
}

if (
  ["rinkeby", "goerli", "mainnet"].includes(argv.network) &&
  ALCHEMY_API_KEY === undefined
) {
  throw new Error(
    `Could not find Infura key in env, unable to connect to network ${argv.network}`,
  );
}

initiateAuction();
clearAuction();
clearAuctionSimplified();
createVestingStrategy();
placeManyOrders();
createTestToken()

export default {
  paths: {
    artifacts: "build/artifacts",
    cache: "build/cache",
    deploy: "src/deploy",
    sources: "contracts",
  },
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
      },
    },
  },
  networks: {
    hardhat: {
      accounts: {
        count: 100,
        accountsBalance: "1000000000000000000000000000000",
      },
    },
    mainnet: {
      ...sharedNetworkConfig,
      url: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      gasPrice: GAS_PRICE_GWEI
        ? parseInt(
            utils.parseUnits(GAS_PRICE_GWEI.toString(), "gwei").toString(),
          )
        : "auto",
    },
    arbitrum: {
      ...sharedNetworkConfig,
      url: `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      gasPrice: GAS_PRICE_GWEI
        ? parseInt(
            utils.parseUnits(GAS_PRICE_GWEI.toString(), "gwei").toString(),
          )
        : "auto",
    },
    goerli: {
      ...sharedNetworkConfig,
      url: `https://arb-goerli.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      chainId: 421613,
      timeout: 18000000,
      gasPrice:"auto"
    },
  },
  namedAccounts: {
    deployer: 0,
  },
  mocha: {
    timeout: 2000000,
  },
  etherscan: {
    apiKey: MY_ETHERSCAN_API_KEY,
  },
};

