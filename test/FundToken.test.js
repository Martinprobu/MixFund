const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("FundToken", function () {
    async function deployFundTokenFixture() {
        const [owner, user1, user2] = await ethers.getSigners();
        const FundToken = await ethers.getContractFactory("FundToken");
        const fundToken = await FundToken.deploy("FundToken", "FT");
        return { fundToken, owner, user1, user2 };
    }

    describe("Deployment", function () {
        it("Should set the right token name", async function () {
            const { fundToken } = await loadFixture(deployFundTokenFixture);
            expect(await fundToken.tokenName()).to.equal("FundToken");
        });

        it("Should set the right token symbol", async function () {
            const { fundToken } = await loadFixture(deployFundTokenFixture);
            expect(await fundToken.tokenSymbol()).to.equal("FT");
        });

        it("Should set the right owner", async function () {
            const { fundToken, owner } = await loadFixture(deployFundTokenFixture);
            expect(await fundToken.owner()).to.equal(owner.address);
        });

        it("Should start with zero total supply", async function () {
            const { fundToken } = await loadFixture(deployFundTokenFixture);
            expect(await fundToken.totalSupply()).to.equal(0);
        });
    });

    describe("mint()", function () {
        it("Should increase caller's balance", async function () {
            const { fundToken, user1 } = await loadFixture(deployFundTokenFixture);
            await fundToken.connect(user1).mint(100);
            expect(await fundToken.balanceOf(user1.address)).to.equal(100);
        });

        it("Should increase total supply", async function () {
            const { fundToken, user1 } = await loadFixture(deployFundTokenFixture);
            await fundToken.connect(user1).mint(100);
            expect(await fundToken.totalSupply()).to.equal(100);
        });

        it("Should accumulate on multiple mints", async function () {
            const { fundToken, user1 } = await loadFixture(deployFundTokenFixture);
            await fundToken.connect(user1).mint(100);
            await fundToken.connect(user1).mint(50);
            expect(await fundToken.balanceOf(user1.address)).to.equal(150);
            expect(await fundToken.totalSupply()).to.equal(150);
        });
    });

    describe("transfer()", function () {
        it("Should transfer tokens between accounts", async function () {
            const { fundToken, user1, user2 } = await loadFixture(deployFundTokenFixture);
            await fundToken.connect(user1).mint(100);
            await fundToken.connect(user1).transfer(user2.address, 40);
            expect(await fundToken.balanceOf(user1.address)).to.equal(60);
            expect(await fundToken.balanceOf(user2.address)).to.equal(40);
        });

        it("Should revert if balance is insufficient", async function () {
            const { fundToken, user1, user2 } = await loadFixture(deployFundTokenFixture);
            await fundToken.connect(user1).mint(10);
            await expect(
                fundToken.connect(user1).transfer(user2.address, 100)
            ).to.be.revertedWith("Insufficient balance");
        });

        it("Should revert if sender has no tokens", async function () {
            const { fundToken, user1, user2 } = await loadFixture(deployFundTokenFixture);
            await expect(
                fundToken.connect(user1).transfer(user2.address, 1)
            ).to.be.revertedWith("Insufficient balance");
        });
    });

    describe("balanceOf()", function () {
        it("Should return 0 for address with no tokens", async function () {
            const { fundToken, user1 } = await loadFixture(deployFundTokenFixture);
            expect(await fundToken.balanceOf(user1.address)).to.equal(0);
        });

        it("Should return correct balance after mint and transfer", async function () {
            const { fundToken, user1, user2 } = await loadFixture(deployFundTokenFixture);
            await fundToken.connect(user1).mint(200);
            await fundToken.connect(user1).transfer(user2.address, 80);
            expect(await fundToken.balanceOf(user1.address)).to.equal(120);
            expect(await fundToken.balanceOf(user2.address)).to.equal(80);
        });
    });
});
