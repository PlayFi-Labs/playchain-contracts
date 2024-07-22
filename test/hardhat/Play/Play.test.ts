import {parseEther, Wallet} from "ethers";
import hre, { ethers, upgrades } from "hardhat";
import { Contracts, setupIntegration } from "../_helpers/evm/index";
import { expect } from "chai";
import { User } from "../_helpers/evm";
import { Play } from "../../../typechain";


describe("Play", () => {
  let contracts: Contracts;
  let deployer: User;
  let admin: User;
  let users: User[];

  beforeEach(async () => {
    ({ contracts, deployer, admin, users } =
      await setupIntegration());
  });

  describe("Contract Functionality", async function () {
    it("admin address cannot be 0 on initializing", async function () {
        const deployerSigner = await ethers.getSigner(deployer.address);
        const playFactory = await ethers.getContractFactory("Play");
        await expect(playFactory.connect(deployerSigner).deploy(ethers.ZeroAddress)).to.be.revertedWithCustomError(contracts.Play, "InvalidAddress");
    });

    it("initializing the contract sets the correct on-chain states", async function () {
        const deployerSigner = await ethers.getSigner(deployer.address);
        const playFactory = await ethers.getContractFactory("Play");
        let play = await playFactory.connect(deployerSigner).deploy(admin.address);
        await play.waitForDeployment();
        const adminRole = await play.ADMIN_ROLE();
        const mintingRole = await play.MINTER_ROLE();
        const burningRole = await play.BURNER_ROLE();
        expect(await play.hasRole(adminRole, admin.address)).to.be.equal(true);
        expect(await play.hasRole(adminRole, users[10].address)).to.be.equal(false);
        expect(await play.hasRole(mintingRole, admin.address)).to.be.equal(true);
        expect(await play.hasRole(mintingRole, users[10].address)).to.be.equal(false);
        expect(await play.hasRole(burningRole, admin.address)).to.be.equal(true);
        expect(await play.hasRole(burningRole, users[10].address)).to.be.equal(false);
    });

      it("minting cannot be done if the user has no minting role", async function () {
          await expect(users[10].Play.mint(users[10].address,ethers.parseEther("100"))).to.be.revertedWithCustomError(contracts.Play,"MintingDenied");
      });

      it("minting mints the given amount of tokens to the given address", async function () {
          expect(await contracts.Play.totalSupply()).to.be.equal(0);
          await admin.Play.mint(users[10].address,ethers.parseEther("100"));
          expect(await contracts.Play.totalSupply()).to.be.equal(ethers.parseEther("100"));
          expect(await contracts.Play.balanceOf(users[10].address)).to.be.equal(ethers.parseEther("100"));
      });

      it("burning cannot be done if the user has no minting role", async function () {
          await admin.Play.mint(users[10].address,ethers.parseEther("100"));
          await expect(users[10].Play.burn(ethers.parseEther("100"))).to.be.revertedWithCustomError(contracts.Play,"BurningDenied");
      });

      it("burning burns the given amount of tokens", async function () {
          expect(await contracts.Play.totalSupply()).to.be.equal(0);
          await admin.Play.mint(admin.address,ethers.parseEther("100"));
          expect(await contracts.Play.totalSupply()).to.be.equal(ethers.parseEther("100"));
          expect(await contracts.Play.balanceOf(admin.address)).to.be.equal(ethers.parseEther("100"));
          await admin.Play.burn(ethers.parseEther("100"));
          expect(await contracts.Play.totalSupply()).to.be.equal(ethers.parseEther("0"));
          expect(await contracts.Play.balanceOf(admin.address)).to.be.equal(ethers.parseEther("0"));
      });
  });

});
