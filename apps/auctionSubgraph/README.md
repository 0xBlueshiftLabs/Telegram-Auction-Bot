# Credit-subgraph

## Overview

This subgraph tracks the activity of the Credit protocol. It tracks the following events:

- CreatePair
- Borrow
- Burn
- Lend
- Mint
- Pay
- Sync
- Withdraw
- Transfer

## Usage

### Local deployment

#### Starting Graph Node locally (install docker first)

```bash
git clone https://github.com/graphprotocol/graph-node
cd graph-node/docker
./setup.sh
docker-compose up
```

Remove the data from the subgraph if you want to start from scratch:

```bash
docker-compose down -v && sudo rm -rf data/ && docker-compose up
```

#### Initializing new subgraph

Modify the config:

- `config/localhost.json`: Modify the `lending_factory.address` and the `convenience_address` values

Deploy the subgraph locally:

```bash
yarn 
yarn run prepare:local # generate the subgraph.yaml
yarn codegen
yarn create-local
yarn deploy-local
```

> Note: If the subgraph is throwing errors, you might notice `indexing-error` when querying the subgraph. One solution is to add `subgraphError: allow` in your graphql query. The other solution is to remove the data from the subgraph and restart the graph node (and potentially fix the issue in the mappings code).