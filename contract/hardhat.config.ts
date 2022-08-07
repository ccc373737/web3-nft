import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const TEST_URL = "https://ropsten.infura.io/v3/779f6dd9eae74cb9917d96e088fc1547";
const PRIVATE_KEY = "cb9f200def7ba91fd7ad5852df10b324f9b231176ed4bd78b1f76c08e36e53d2";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },

  networks: {
    ropsten: {
      url: `${TEST_URL}`,
      accounts: [`${PRIVATE_KEY}`]
    },
  }
};

export default config;
