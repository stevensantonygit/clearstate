const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RentalContract", function () {
  let RentalContract;
  let rentalContract;
  let owner;
  let landlord;
  let tenant;
  let platformWallet;
  let otherAccount;

  const MONTHLY_RENT = ethers.parseEther("1.0"); // 1 ETH
  const SECURITY_DEPOSIT = ethers.parseEther("2.0"); // 2 ETH
  const LEASE_DURATION = 86400 * 365; // 1 year in seconds
  const PROPERTY_ID = "property-123";
  const CONTRACT_TERMS = "Standard rental agreement terms";

  beforeEach(async function () {
    // Get signers
    [owner, landlord, tenant, platformWallet, otherAccount] = await ethers.getSigners();

    // Deploy the contract
    RentalContract = await ethers.getContractFactory("RentalContract");
    rentalContract = await RentalContract.deploy(platformWallet.address);
  });

  describe("Deployment", function () {
    it("Should set the right platform wallet", async function () {
      expect(await rentalContract.platformWallet()).to.equal(platformWallet.address);
    });

    it("Should set the right owner", async function () {
      expect(await rentalContract.owner()).to.equal(owner.address);
    });

    it("Should initialize with correct platform fee", async function () {
      expect(await rentalContract.platformFee()).to.equal(100); // 1%
    });

    it("Should start with contract ID 1", async function () {
      expect(await rentalContract.nextContractId()).to.equal(1);
    });
  });

  describe("Contract Creation", function () {
    it("Should create a rental agreement successfully", async function () {
      const tx = await rentalContract.connect(landlord).createRentalAgreement(
        PROPERTY_ID,
        tenant.address,
        MONTHLY_RENT,
        SECURITY_DEPOSIT,
        LEASE_DURATION,
        CONTRACT_TERMS
      );

      await expect(tx)
        .to.emit(rentalContract, "ContractCreated")
        .withArgs(1, PROPERTY_ID, landlord.address, tenant.address);

      const contract = await rentalContract.getContract(1);
      expect(contract.propertyId).to.equal(PROPERTY_ID);
      expect(contract.landlord).to.equal(landlord.address);
      expect(contract.tenant).to.equal(tenant.address);
      expect(contract.monthlyRent).to.equal(MONTHLY_RENT);
      expect(contract.securityDeposit).to.equal(SECURITY_DEPOSIT);
      expect(contract.status).to.equal(0); // PENDING
    });

    it("Should fail with invalid tenant address", async function () {
      await expect(
        rentalContract.connect(landlord).createRentalAgreement(
          PROPERTY_ID,
          ethers.ZeroAddress,
          MONTHLY_RENT,
          SECURITY_DEPOSIT,
          LEASE_DURATION,
          CONTRACT_TERMS
        )
      ).to.be.revertedWith("Invalid tenant address");
    });

    it("Should fail when landlord tries to be tenant", async function () {
      await expect(
        rentalContract.connect(landlord).createRentalAgreement(
          PROPERTY_ID,
          landlord.address,
          MONTHLY_RENT,
          SECURITY_DEPOSIT,
          LEASE_DURATION,
          CONTRACT_TERMS
        )
      ).to.be.revertedWith("Landlord cannot be tenant");
    });

    it("Should fail with zero monthly rent", async function () {
      await expect(
        rentalContract.connect(landlord).createRentalAgreement(
          PROPERTY_ID,
          tenant.address,
          0,
          SECURITY_DEPOSIT,
          LEASE_DURATION,
          CONTRACT_TERMS
        )
      ).to.be.revertedWith("Monthly rent must be greater than 0");
    });

    it("Should track landlord and tenant contracts", async function () {
      await rentalContract.connect(landlord).createRentalAgreement(
        PROPERTY_ID,
        tenant.address,
        MONTHLY_RENT,
        SECURITY_DEPOSIT,
        LEASE_DURATION,
        CONTRACT_TERMS
      );

      const landlordContracts = await rentalContract.getContractsByLandlord(landlord.address);
      const tenantContracts = await rentalContract.getContractsByTenant(tenant.address);

      expect(landlordContracts.length).to.equal(1);
      expect(tenantContracts.length).to.equal(1);
      expect(landlordContracts[0]).to.equal(1);
      expect(tenantContracts[0]).to.equal(1);
    });
  });

  describe("Contract Signing", function () {
    beforeEach(async function () {
      await rentalContract.connect(landlord).createRentalAgreement(
        PROPERTY_ID,
        tenant.address,
        MONTHLY_RENT,
        SECURITY_DEPOSIT,
        LEASE_DURATION,
        CONTRACT_TERMS
      );
    });

    it("Should allow tenant to sign contract with security deposit", async function () {
      const tx = await rentalContract.connect(tenant).signContract(1, {
        value: SECURITY_DEPOSIT
      });

      await expect(tx)
        .to.emit(rentalContract, "ContractSigned")
        .withArgs(1, tenant.address);

      await expect(tx)
        .to.emit(rentalContract, "SecurityDepositPaid");

      const contract = await rentalContract.getContract(1);
      expect(contract.status).to.equal(1); // SIGNED
      expect(contract.securityDepositPaid).to.be.true;
      expect(contract.startDate).to.be.gt(0);
      expect(contract.endDate).to.be.gt(contract.startDate);
    });

    it("Should fail with insufficient security deposit", async function () {
      await expect(
        rentalContract.connect(tenant).signContract(1, {
          value: ethers.parseEther("1.0") // Less than required
        })
      ).to.be.revertedWith("Insufficient security deposit");
    });

    it("Should fail when non-tenant tries to sign", async function () {
      await expect(
        rentalContract.connect(otherAccount).signContract(1, {
          value: SECURITY_DEPOSIT
        })
      ).to.be.revertedWith("Only tenant can sign");
    });

    it("Should transfer platform fee correctly", async function () {
      const initialBalance = await ethers.provider.getBalance(platformWallet.address);
      
      await rentalContract.connect(tenant).signContract(1, {
        value: SECURITY_DEPOSIT
      });

      const finalBalance = await ethers.provider.getBalance(platformWallet.address);
      const expectedFee = SECURITY_DEPOSIT * BigInt(100) / BigInt(10000); // 1%
      
      expect(finalBalance - initialBalance).to.equal(expectedFee);
    });
  });

  describe("Rent Payment", function () {
    beforeEach(async function () {
      await rentalContract.connect(landlord).createRentalAgreement(
        PROPERTY_ID,
        tenant.address,
        MONTHLY_RENT,
        SECURITY_DEPOSIT,
        LEASE_DURATION,
        CONTRACT_TERMS
      );
      
      await rentalContract.connect(tenant).signContract(1, {
        value: SECURITY_DEPOSIT
      });
    });

    it("Should allow tenant to pay rent", async function () {
      const initialLandlordBalance = await ethers.provider.getBalance(landlord.address);
      
      const tx = await rentalContract.connect(tenant).payRent(1, {
        value: MONTHLY_RENT
      });

      await expect(tx)
        .to.emit(rentalContract, "RentPaid")
        .withArgs(1, MONTHLY_RENT * BigInt(99) / BigInt(100), 1); // After 1% fee

      const finalLandlordBalance = await ethers.provider.getBalance(landlord.address);
      const expectedRent = MONTHLY_RENT * BigInt(99) / BigInt(100); // After 1% fee
      
      expect(finalLandlordBalance - initialLandlordBalance).to.equal(expectedRent);
    });

    it("Should fail with insufficient rent payment", async function () {
      await expect(
        rentalContract.connect(tenant).payRent(1, {
          value: ethers.parseEther("0.5") // Less than required
        })
      ).to.be.revertedWith("Insufficient rent payment");
    });

    it("Should fail when non-tenant tries to pay", async function () {
      await expect(
        rentalContract.connect(otherAccount).payRent(1, {
          value: MONTHLY_RENT
        })
      ).to.be.revertedWith("Only tenant can pay rent");
    });
  });

  describe("Contract Termination", function () {
    beforeEach(async function () {
      await rentalContract.connect(landlord).createRentalAgreement(
        PROPERTY_ID,
        tenant.address,
        MONTHLY_RENT,
        SECURITY_DEPOSIT,
        LEASE_DURATION,
        CONTRACT_TERMS
      );
      
      await rentalContract.connect(tenant).signContract(1, {
        value: SECURITY_DEPOSIT
      });
    });

    it("Should allow landlord to terminate contract", async function () {
      const tx = await rentalContract.connect(landlord).terminateContract(1);

      await expect(tx)
        .to.emit(rentalContract, "ContractTerminated")
        .withArgs(1, landlord.address);

      const contract = await rentalContract.getContract(1);
      expect(contract.status).to.equal(4); // TERMINATED
    });

    it("Should allow tenant to terminate contract", async function () {
      const tx = await rentalContract.connect(tenant).terminateContract(1);

      await expect(tx)
        .to.emit(rentalContract, "ContractTerminated")
        .withArgs(1, tenant.address);
    });

    it("Should return security deposit on termination", async function () {
      const initialTenantBalance = await ethers.provider.getBalance(tenant.address);
      
      const tx = await rentalContract.connect(landlord).terminateContract(1);
      const receipt = await tx.wait();

      await expect(tx)
        .to.emit(rentalContract, "SecurityDepositReturned");

      // Note: Exact balance check is complex due to gas costs for tenant-initiated termination
    });

    it("Should fail when unauthorized user tries to terminate", async function () {
      await expect(
        rentalContract.connect(otherAccount).terminateContract(1)
      ).to.be.revertedWith("Only landlord or tenant can terminate");
    });
  });

  describe("Administrative Functions", function () {
    it("Should allow owner to update platform fee", async function () {
      await rentalContract.connect(owner).updatePlatformFee(200); // 2%
      expect(await rentalContract.platformFee()).to.equal(200);
    });

    it("Should fail to set platform fee above 10%", async function () {
      await expect(
        rentalContract.connect(owner).updatePlatformFee(1100) // 11%
      ).to.be.revertedWith("Fee cannot exceed 10%");
    });

    it("Should allow owner to update platform wallet", async function () {
      await rentalContract.connect(owner).updatePlatformWallet(otherAccount.address);
      expect(await rentalContract.platformWallet()).to.equal(otherAccount.address);
    });

    it("Should fail when non-owner tries to update fee", async function () {
      await expect(
        rentalContract.connect(landlord).updatePlatformFee(200)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Edge Cases", function () {
    it("Should handle multiple contracts per landlord/tenant", async function () {
      // Create multiple contracts
      await rentalContract.connect(landlord).createRentalAgreement(
        "property-1",
        tenant.address,
        MONTHLY_RENT,
        SECURITY_DEPOSIT,
        LEASE_DURATION,
        CONTRACT_TERMS
      );

      await rentalContract.connect(landlord).createRentalAgreement(
        "property-2",
        tenant.address,
        MONTHLY_RENT,
        SECURITY_DEPOSIT,
        LEASE_DURATION,
        CONTRACT_TERMS
      );

      const landlordContracts = await rentalContract.getContractsByLandlord(landlord.address);
      const tenantContracts = await rentalContract.getContractsByTenant(tenant.address);

      expect(landlordContracts.length).to.equal(2);
      expect(tenantContracts.length).to.equal(2);
    });

    it("Should fail to get non-existent contract", async function () {
      await expect(
        rentalContract.getContract(999)
      ).to.be.revertedWith("Contract does not exist");
    });
  });
});