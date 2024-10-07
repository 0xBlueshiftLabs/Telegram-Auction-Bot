import { ChainIds } from "../../constants";
import dotenv from "dotenv";
import { ChainMapping } from "types/assets";

dotenv.config({ path: "../../.env" });

export const GRAPH_URI: ChainMapping = {
  [ChainIds.LOCALHOST]: `https://b63f-2804-388-e07c-3451-d19e-d2f9-bb4e-5755.ngrok-free.app/graph`,
  [ChainIds.ARBITRUM_GOERLI]: `https://api.goldsky.com/api/public/project_clm5qt3p4rajs38v85owch1oh/subgraphs/auction-subgraph-goerli/1.0.0/gn`,
};
