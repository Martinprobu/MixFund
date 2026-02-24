require("@nomicfoundation/hardhat-toolbox")
// require("dotenv").config()
require("@chainlink/env-enc").config()

require("@nomicfoundation/hardhat-toolbox")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/0qJFsVpbEl1FIs2S1ioEk",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111
    }
  }
};
