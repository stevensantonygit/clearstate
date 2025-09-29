# 🚀 Yellow Network Smart Contract Setup Guide

## Prerequisites

Before you can use the smart contract features, you need to set up several components:

## 1. 🔑 **Crypto Wallet Setup**

### Get a MetaMask Wallet:
1. Install MetaMask browser extension
2. Create a new wallet or import existing one
3. **Save your private key securely** (you'll need this for deployment)
4. Get some YEL tokens for Yellow Network testnet

### Add Yellow Network to MetaMask:
```
Network Name: Yellow Network Testnet
RPC URL: https://rpc.testnet.yellow.org
Chain ID: 10001
Currency Symbol: YEL
Block Explorer: https://explorer.testnet.yellow.org
```

## 2. 💰 **Get Test Tokens**

### Yellow Network Testnet Faucet:
1. Visit: https://faucet.testnet.yellow.org
2. Enter your wallet address
3. Request test YEL tokens
4. Wait for transaction confirmation

## 3. 🔧 **Environment Configuration**

### Create .env.local file:
```bash
# Copy the example file
cp .env.example .env.local
```

### Fill in the required values:

#### **PRIVATE_KEY** (Required for deployment):
```
PRIVATE_KEY=0x1234567890abcdef...
```
⚠️ **Never share your private key publicly!**

#### **YELLOW_EXPLORER_API_KEY** (Optional):
```
YELLOW_EXPLORER_API_KEY=your_api_key_here
```
Get from: https://explorer.testnet.yellow.org/api-docs

#### **PLATFORM_WALLET_ADDRESS** (Pre-configured):
```
PLATFORM_WALLET_ADDRESS=0x742d35Cc6635C0532925a3b8D51d13f9a0b8A2a9
```
This receives platform fees (1% of transactions)

## 4. 📜 **Deploy Smart Contract**

### Install contract dependencies:
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install @openzeppelin/contracts dotenv
```

### Compile the contract:
```bash
npx hardhat compile
```

### Deploy to Yellow Network:
```bash
npx hardhat run scripts/deploy-rental-contract.js --network yellow
```

### Update deployment info:
After successful deployment, update `deployment-info.json` with:
- `contractAddress`: The deployed contract address
- `deployer`: Your wallet address
- `txHash`: The deployment transaction hash

## 5. 🎯 **Testing the Integration**

### Frontend Testing (No deployment needed):
1. Start the development server: `npm run dev`
2. Go to `/create-contract` page
3. Click "Connect Wallet" - should show MetaMask popup
4. Switch to Yellow Network when prompted
5. Fill in contract details (use dummy values for testing UI)

### Full Contract Testing (Requires deployment):
1. Deploy the contract first (step 4)
2. Update `deployment-info.json` with real contract address
3. Go to `/create-contract` page
4. Connect your MetaMask wallet
5. Create a real rental contract
6. Pay with YEL tokens

## 6. 🔍 **Verification**

### Check if everything is working:

#### **Wallet Connection**:
- MetaMask popup appears when clicking "Connect Wallet"
- Yellow Network is added to MetaMask automatically
- Your wallet address is displayed after connection

#### **Contract Creation** (UI only):
- Form validates input correctly
- No TypeScript errors in console
- Loading states work properly

#### **Full Integration** (After deployment):
- Transaction appears in Yellow Network Explorer
- Contract address is generated
- YEL tokens are deducted from wallet
- Contract data is stored on blockchain

## 7. 🛠️ **Current Status**

### ✅ **What's Already Working**:
- Smart contract code (Solidity)
- Frontend integration (TypeScript/React)
- Wallet connection logic
- Yellow Network configuration
- UI components and forms

### ⏳ **What You Need to Configure**:
- Environment variables (.env.local)
- Private key for deployment
- Deploy actual contract to Yellow Network
- Update contract address in deployment-info.json

### 🎯 **For Testing Without Real Deployment**:
You can test the UI and wallet connection immediately:
1. `npm run dev`
2. Go to `/create-contract`
3. Test wallet connection (MetaMask required)
4. Fill forms and test validation
5. UI will work, but transactions won't be real without deployment

## 8. 📞 **Support Resources**

- **Yellow Network Docs**: https://docs.yellow.org
- **Yellow Network Discord**: https://discord.gg/yellow
- **Testnet Explorer**: https://explorer.testnet.yellow.org
- **Hardhat Docs**: https://hardhat.org/docs

## ⚠️ **Security Notes**

1. **Never commit private keys** to version control
2. **Use testnet first** before mainnet deployment
3. **Test thoroughly** before handling real money
4. **Keep private keys secure** and backed up
5. **Use environment variables** for sensitive data

---

Once you complete these steps, your PropertySG platform will have full blockchain rental contract capabilities! 🚀