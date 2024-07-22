import { task } from "hardhat/config";

import { VERIFYCONTRACTS } from "./task-names";
import { NomicLabsHardhatPluginError } from "hardhat/plugins";

task(VERIFYCONTRACTS, "Verifies the PlayFi contracts", async (_taskArgs, hre) => {
  const { deployments, getNamedAccounts, upgrades } = hre;

  const { admin } = await getNamedAccounts();
  let play = (await deployments.get("PlayFiLicenseSale")).address;

  try {
    await hre.run("verify:verify", {
      address: play,
      constructorArguments: [admin],
    });
  } catch (e) {
    // @ts-ignore
    if (e.name === "NomicLabsHardhatPluginError" && e.message.indexOf("Contract source code already verified") !== -1) {
      console.log("Contract source already verified!");
    } else {
      console.log(e);
    }
  }

});
