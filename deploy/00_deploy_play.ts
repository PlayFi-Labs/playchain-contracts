import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers } from "ethers";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;

    const {
        deployer,
        admin,
    } = await getNamedAccounts();

    await deploy("Pay", {
        contract: "Play",
        from: deployer,
        log: true,
        args: [admin],
    });

    return true;
};
export default func;
func.id = "DeployPlay";
func.tags = ["DeployPlay"];
