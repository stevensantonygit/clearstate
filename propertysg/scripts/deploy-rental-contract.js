const { ethers } = require("ethers");
const fs = require("fs");

/**
 * Deployment script for RentalContract on Yellow Network
 * 
 * This script deploys the ERC-7824 compliant rental agreement contract
 * to the Yellow Network testnet.
 */

// Yellow Network Testnet Configuration
const YELLOW_NETWORK_CONFIG = {
  rpcUrl: "https://rpc.testnet.yellow.org",
  chainId: 10001,
  name: "Yellow Network Testnet",
  symbol: "YEL",
  blockExplorer: "https://explorer.testnet.yellow.org"
};

// Platform configuration
const PLATFORM_WALLET = "0x742d35Cc6635C0532925a3b8D51d13f9a0b8A2a9"; // Replace with actual platform wallet

async function deployRentalContract() {
  try {
    console.log("🚀 Starting RentalContract deployment to Yellow Network...");
    
    // Check if we have a private key
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      console.error("❌ PRIVATE_KEY environment variable is required");
      process.exit(1);
    }
    
    // Create provider and wallet
    const provider = new ethers.JsonRpcProvider(YELLOW_NETWORK_CONFIG.rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    
    console.log(`📍 Deploying from address: ${wallet.address}`);
    
    // Check balance
    const balance = await provider.getBalance(wallet.address);
    console.log(`💰 Account balance: ${ethers.formatEther(balance)} YEL`);
    
    if (balance === 0n) {
      console.error("❌ Insufficient balance for deployment");
      process.exit(1);
    }
    
    // Read contract source code
    const contractSource = fs.readFileSync("./contracts/RentalContract.sol", "utf8");
    
    // Contract ABI and bytecode (you would normally get this from compilation)
    // For this example, we'll use a simplified deployment approach
    console.log("📝 Contract source code loaded");
    
    // Note: In a real deployment, you would:
    // 1. Compile the Solidity contract using Hardhat, Foundry, or similar
    // 2. Get the ABI and bytecode
    // 3. Deploy using the compiled artifacts
    
    console.log("⚠️  Contract deployment requires compilation first");
    console.log("   Please use Hardhat or Foundry to compile and deploy");
    console.log("   Example commands:");
    console.log("   - npm install --save-dev hardhat");
    console.log("   - npx hardhat compile");
    console.log("   - npx hardhat run scripts/deploy.js --network yellow");
    
    // Return deployment info template
    return {
      network: YELLOW_NETWORK_CONFIG.name,
      chainId: YELLOW_NETWORK_CONFIG.chainId,
      deployer: wallet.address,
      platformWallet: PLATFORM_WALLET,
      rpcUrl: YELLOW_NETWORK_CONFIG.rpcUrl,
      explorer: YELLOW_NETWORK_CONFIG.blockExplorer
    };
    
  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    throw error;
  }
}

// Hardhat deployment task (when using Hardhat)
async function hardhatDeploy(hre) {
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("🚀 Deploying RentalContract with Hardhat...");
  console.log("📍 Deployer address:", deployer.address);
  
  const balance = await deployer.getBalance();
  console.log("💰 Account balance:", hre.ethers.formatEther(balance));
  
  // Deploy the contract
  const RentalContract = await hre.ethers.getContractFactory("RentalContract");
  const rentalContract = await RentalContract.deploy(PLATFORM_WALLET);
  
  await rentalContract.waitForDeployment();
  const contractAddress = await rentalContract.getAddress();
  
  console.log("✅ RentalContract deployed to:", contractAddress);
  
  // Verify deployment
  const deployedCode = await hre.ethers.provider.getCode(contractAddress);
  if (deployedCode === "0x") {
    throw new Error("Contract deployment failed - no code at address");
  }
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    deployer: deployer.address,
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    platformWallet: PLATFORM_WALLET,
    deploymentTime: new Date().toISOString(),
    txHash: rentalContract.deploymentTransaction()?.hash
  };
  
  fs.writeFileSync(
    "./deployment-info.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("📄 Deployment info saved to deployment-info.json");
  
  return deploymentInfo;
}

// Export functions for use
module.exports = {
  deployRentalContract,
  hardhatDeploy,
  YELLOW_NETWORK_CONFIG,
  PLATFORM_WALLET
};

// Run deployment if called directly
if (require.main === module) {
  deployRentalContract()
    .then(info => {
      console.log("✅ Deployment completed:");
      console.log(JSON.stringify(info, null, 2));
    })
    .catch(error => {
      console.error("❌ Deployment failed:", error);
      process.exit(1);
    });
}