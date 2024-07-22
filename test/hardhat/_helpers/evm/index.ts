import hre, { deployments, getNamedAccounts, getUnnamedAccounts, upgrades } from "hardhat";
import { setupUser, setupUsers } from "./../accounts";
import { Play } from "../../../../typechain";

export interface Contracts {
  Play: Play;
}

export interface User extends Contracts {
  address: string;
}

// USE MAINNET FORK AT 20361071
export const setupIntegration = deployments.createFixture(async ({ ethers }) => {
  const {
    deployer,
    admin,
  } = await getNamedAccounts();

  const TOP_ETH = "0x00000000219ab540356cBB839Cbe05303d7705Fa";
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [TOP_ETH],
  });
  const whale = await ethers.provider.getSigner(TOP_ETH);
  await whale.sendTransaction({ to: deployer, value: ethers.parseEther("10.0") });
  await whale.sendTransaction({ to: admin, value: ethers.parseEther("10.0") });
  await deployments.fixture(["DeployPlay"]);

  const deployerSigner = await ethers.getSigner(deployer);

  const playFactory = await ethers.getContractFactory("Play");
  const play = (await playFactory.connect(deployerSigner).deploy(admin)) as Play;
  await play.waitForDeployment();

  const contracts: Contracts = {
    Play: play
  };

  const users: User[] = await setupUsers(await getUnnamedAccounts(), contracts);

  return {
    contracts,
    deployer: <User>await setupUser(deployer, contracts),
    admin: <User>await setupUser(admin, contracts),
    users,
  };
});
