import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";

import "@openzeppelin/hardhat-upgrades";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-verify";
import "@nomicfoundation/hardhat-chai-matchers";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-contract-sizer";

dotenv.config();

import "./tasks/verify-contracts";

const config: HardhatUserConfig = {
  typechain: {
    target: "ethers-v6",
  },
  mocha: {
    timeout: 10000000000,
  },
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 9999,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: process.env.FORKING == "true" ? 1 : 31337,
      forking: {
        url:
            "https://mainnet.infura.io/v3/" +
            (process.env.INFURA_KEY !== undefined ? process.env.INFURA_KEY : ""),
        blockNumber: 20361071,
        enabled: process.env.FORKING !== undefined && process.env.FORKING == "true" ? true : false,
      },
      accounts: {
        count: 300,
      },
    },
    sepolia: {
      url: "https://sepolia.infura.io/v3/" + (process.env.INFURA_KEY !== undefined ? process.env.INFURA_KEY : ""),
      accounts: process.env.SEPOLIA_PRIVATE_KEY !== undefined ? [process.env.SEPOLIA_PRIVATE_KEY] : [],
    },
    ethereum: {
      url: "https://mainnet.infura.io/v3/" + (process.env.INFURA_KEY !== undefined ? process.env.INFURA_KEY : ""),
      accounts: process.env.MAINNET_PRIVATE_KEY !== undefined ? [process.env.MAINNET_PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY !== undefined ? process.env.ETHERSCAN_API_KEY : "",
      sepolia: process.env.ETHERSCAN_API_KEY !== undefined ? process.env.ETHERSCAN_API_KEY : "",
    },
    customChains: [],
  },
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0, //TODO: set correct address
      11155111: 0
    },
    admin: {
      default: 1,
      1: 1,//TODO: set correct address
      11155111: "0xf558c6EECcf47ce88E644Ce48DD6ca9176e2C23b"
    },
  },
};

export default config;
