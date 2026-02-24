# 众筹合约

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js





rm -rf node_modules package-lock.json hardhat.config.js

npm install hardhat --save-dev --ignore-scripts

npm install --save-dev @nomicfoundation/hardhat-toolbox

npx hardhat init

npm install esbuild@0.19.11 --save-dev

npm rebuild esbuild

npx hardhat --version
3.1.9
npx hardhat compile

npx hardhat deploy

npx hardhat run scripts/deployFundMe.js

npx hardhat run scripts/deployFundMe.js --network sepolia

npx hardhat verify --network sepolia --build-profile default 0x1234567890...



# node
# 启动本地节点（新终端）
npx hardhat node

# 连接控制台（原终端）
// 1. 启动 console
npx hardhat console --network localhost

// 2. 在 console 中执行
> const addr = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
> const balance = await ethers.provider.getBalance(addr);
> ethers.formatEther(balance) 
'10000.0'  // 输出：10000 ETH


npm install --save-dev dotenv
npm add --save-dev @nomicfoundation/hardhat-verify
npm install --save-dev @chainlink/env-enc

npx env-enc set-pw

npx env-enc set 
PRIVATE_KEY
xxxx




```
