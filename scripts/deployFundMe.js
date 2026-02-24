// import ethers.js
// create main function
// execute main function


const { ethers } = require("hardhat")

async function main() {
    // create factory
    const fundMeFactory = await ethers.getContractFactory("FundMe")
    console.log(`contract deployed begin`)
    // deploy
    const fundMe = await fundMeFactory.deploy()
    await fundMe.waitForDeployment()
    console.log(`contract deployed success, contract addr is ${fundMe.target}`)

}

 
main().then().catch((error) => {
    console.error(error)
    process.exit(1)
})

