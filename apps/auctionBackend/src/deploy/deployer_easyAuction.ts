import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { getWETH9Address, isAvaxNetwork } from "../tasks/utils";
import { contractNames } from "../ts/deploy";


const deployEasyContract: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment,
) {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();
  const { deploy, get } = deployments;
  const { depositAndPlaceOrder,referralRewardManager,easyAuction,strategyManager,weth9 } = contractNames;
  const chainId = (await hre.ethers.provider.getNetwork()).chainId;

  let weth9Deployed
  if(chainId === 31337){
    await deploy(weth9, {
      from: deployer,
      gasLimit: 9500000,
      args: [],
      log: true,
    });

     weth9Deployed = await get(weth9);
  }

  await deploy(referralRewardManager, {
    from: deployer,
    gasLimit: 9500000,
    args: [],
    log: true,
  });

  const referralRewardManagerDeployed = await get(referralRewardManager);

  console.log('rerere')

  await deploy(strategyManager, {
    from: deployer,
    gasLimit: 8000000,
    args: [],
    log: true,
  });

  const strategyManagerDeployed = await get(strategyManager);


  await deploy(easyAuction, {
    from: deployer,
    gasLimit: 9500000,
    args: [referralRewardManagerDeployed.address,strategyManagerDeployed.address],
    log: true,
  });
  const easyAuctionDeployed = await get(easyAuction);
  const weth9Address = await getWETH9Address(hre);


  console.log('rerere1')
  // create ReferralRewardManager instance
  const referralRewardManagerContract = await hre.ethers.getContractAt(
    "ReferralRewardManager",
    referralRewardManagerDeployed.address,
  );
  console.log("here",referralRewardManagerContract.address)

  await referralRewardManagerContract.setAuction(
    easyAuctionDeployed.address,
  );

  console.log("here1")

  await deploy(depositAndPlaceOrder, {
    from: deployer,
    gasLimit: 8000000,
    args: [easyAuctionDeployed.address, chainId===31337?weth9Deployed?.address: weth9Address],
    log: true,
  });
};

export default deployEasyContract;
