const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("FundMe", function () {
    async function deployFundMeFixture() {
        const [owner, funder1, funder2] = await ethers.getSigners();
        const FundMe = await ethers.getContractFactory("FundMe");
        const fundMe = await FundMe.deploy();
        return { fundMe, owner, funder1, funder2 };
    }

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            const { fundMe, owner } = await loadFixture(deployFundMeFixture);
            expect(await fundMe.owner()).to.equal(owner.address);
        });
    });

    describe("fund()", function () {
        it("Should record funder's amount", async function () {
            const { fundMe, funder1 } = await loadFixture(deployFundMeFixture);
            const sendValue = ethers.parseEther("1");
            await fundMe.connect(funder1).fund({ value: sendValue });
            expect(await fundMe.fundersToAmount(funder1.address)).to.equal(sendValue);
        });

        it("Should increase the contract balance", async function () {
            const { fundMe, funder1 } = await loadFixture(deployFundMeFixture);
            const sendValue = ethers.parseEther("1");
            await fundMe.connect(funder1).fund({ value: sendValue });
            expect(await ethers.provider.getBalance(fundMe.target)).to.equal(sendValue);
        });

        it("Should allow multiple funders", async function () {
            const { fundMe, funder1, funder2 } = await loadFixture(deployFundMeFixture);
            await fundMe.connect(funder1).fund({ value: ethers.parseEther("1") });
            await fundMe.connect(funder2).fund({ value: ethers.parseEther("2") });
            expect(await fundMe.fundersToAmount(funder1.address)).to.equal(ethers.parseEther("1"));
            expect(await fundMe.fundersToAmount(funder2.address)).to.equal(ethers.parseEther("2"));
        });
    });

    describe("getFund()", function () {
        it("Should allow owner to withdraw", async function () {
            const { fundMe, owner, funder1 } = await loadFixture(deployFundMeFixture);
            await fundMe.connect(funder1).fund({ value: ethers.parseEther("1") });
            await expect(fundMe.connect(owner).getFund()).not.to.be.reverted;
        });

        it("Should transfer balance to owner", async function () {
            const { fundMe, owner, funder1 } = await loadFixture(deployFundMeFixture);
            const sendValue = ethers.parseEther("1");
            await fundMe.connect(funder1).fund({ value: sendValue });
            await expect(fundMe.connect(owner).getFund()).to.changeEtherBalance(owner, sendValue);
        });

        it("Should revert if called by non-owner", async function () {
            const { fundMe, funder1 } = await loadFixture(deployFundMeFixture);
            await fundMe.connect(funder1).fund({ value: ethers.parseEther("1") });
            await expect(fundMe.connect(funder1).getFund()).to.be.revertedWith(
                "this funciton can only be called by owner"
            );
        });
    });

    describe("refund()", function () {
        it("Should refund funder's ETH", async function () {
            const { fundMe, funder1 } = await loadFixture(deployFundMeFixture);
            const sendValue = ethers.parseEther("1");
            await fundMe.connect(funder1).fund({ value: sendValue });
            await expect(fundMe.connect(funder1).refund()).to.changeEtherBalance(funder1, sendValue);
        });

        it("Should reset funder's amount to 0 after refund", async function () {
            const { fundMe, funder1 } = await loadFixture(deployFundMeFixture);
            await fundMe.connect(funder1).fund({ value: ethers.parseEther("1") });
            await fundMe.connect(funder1).refund();
            expect(await fundMe.fundersToAmount(funder1.address)).to.equal(0);
        });

        it("Should revert if funder has no funds", async function () {
            const { fundMe, funder1 } = await loadFixture(deployFundMeFixture);
            await expect(fundMe.connect(funder1).refund()).to.be.revertedWith(
                "there is no fund for you"
            );
        });
    });

    describe("transferOwnership()", function () {
        it("Should transfer ownership to new owner", async function () {
            const { fundMe, owner, funder1 } = await loadFixture(deployFundMeFixture);
            await fundMe.connect(owner).transferOwnership(funder1.address);
            expect(await fundMe.owner()).to.equal(funder1.address);
        });

        it("Should revert if called by non-owner", async function () {
            const { fundMe, funder1, funder2 } = await loadFixture(deployFundMeFixture);
            await expect(
                fundMe.connect(funder1).transferOwnership(funder2.address)
            ).to.be.revertedWith("this funciton can only be called by owner");
        });
    });
});
