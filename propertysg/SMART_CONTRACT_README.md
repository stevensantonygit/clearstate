# PropertySG Smart Contract Integration

## Overview

PropertySG integrates with Yellow Network to provide blockchain-based rental agreements using the ERC-7824 standard. This integration enables automated rent collection, security deposit management, and transparent lease execution.

## Smart Contract Features

### 🏠 **Rental Agreement Management**
- Create rental agreements with customizable terms
- Secure tenant and landlord verification
- Automated contract status tracking
- IPFS integration for contract documents

### 💰 **Payment Processing**
- Automated monthly rent collection
- Security deposit escrow
- Platform fee handling (1% default)
- Multi-currency support via Yellow Network

### 🔐 **Security Features**
- ERC-7824 compliance for standardization
- ReentrancyGuard protection
- Ownable contract with administrative controls
- Emergency withdrawal capabilities

### 📊 **Contract States**
- **PENDING**: Contract created, awaiting tenant signature
- **SIGNED**: Contract active, rent collection enabled
- **ACTIVE**: Ongoing rental period
- **EXPIRED**: Lease term completed
- **TERMINATED**: Early termination by either party

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   PropertySG    │───▶│  Smart Contract  │───▶│ Yellow Network  │
│   Frontend      │    │     Service      │    │   Blockchain    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                       │
         │                        ▼                       │
         │              ┌──────────────────┐             │
         │              │  Rental Contract │             │
         │              │   (Solidity)     │             │
         │              └──────────────────┘             │
         │                        │                       │
         └────────────────────────┼───────────────────────┘
                                  ▼
                        ┌──────────────────┐
                        │    Firebase      │
                        │   (Off-chain     │
                        │    Storage)      │
                        └──────────────────┘
```

## Contract Deployment

### Prerequisites

1. **Environment Setup**
   ```bash
   npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
   npm install @openzeppelin/contracts ethers dotenv
   ```

2. **Yellow Network Testnet Configuration**
   ```env
   PRIVATE_KEY=your_private_key_here
   YELLOW_EXPLORER_API_KEY=your_api_key_here
   ```

3. **Network Details**
   - **Chain ID**: 10001
   - **RPC URL**: https://rpc.testnet.yellow.org
   - **Explorer**: https://explorer.testnet.yellow.org
   - **Currency**: YEL (Yellow Network Token)

### Deployment Steps

1. **Compile Contract**
   ```bash
   npx hardhat compile
   ```

2. **Deploy to Yellow Network**
   ```bash
   npx hardhat run scripts/deploy-rental-contract.js --network yellow
   ```

3. **Verify Contract** (Optional)
   ```bash
   npx hardhat verify --network yellow <CONTRACT_ADDRESS> <PLATFORM_WALLET>
   ```

### Contract Functions

#### **Creating Rental Agreements**
```solidity
function createRentalAgreement(
    string propertyId,
    address tenant,
    uint256 monthlyRent,
    uint256 securityDeposit,
    uint256 leaseDuration,
    string contractTerms
) external returns (uint256 contractId)
```

#### **Signing Contracts**
```solidity
function signContract(uint256 contractId) external payable
```

#### **Paying Rent**
```solidity
function payRent(uint256 contractId) external payable
```

#### **Contract Queries**
```solidity
function getContract(uint256 contractId) external view returns (RentalAgreement)
function getContractsByLandlord(address landlord) external view returns (uint256[])
function getContractsByTenant(address tenant) external view returns (uint256[])
```

## Frontend Integration

### Smart Contract Service

The `SmartContractService` class provides a TypeScript interface for blockchain interactions:

```typescript
// Initialize service
const contractService = new SmartContractService();
await contractService.initialize();

// Create rental contract
const contractId = await contractService.createRentalContract({
  propertyId: 'property-123',
  tenantAddress: '0x...',
  monthlyRent: ethers.parseEther('1.0'),
  securityDeposit: ethers.parseEther('2.0'),
  leaseDuration: 365 * 24 * 60 * 60, // 1 year
  contractTerms: 'Standard lease terms'
});

// Sign contract as tenant
await contractService.signContract(contractId, securityDeposit);

// Pay monthly rent
await contractService.payRent(contractId, monthlyRent);
```

### Rental Contract Form

The UI component handles wallet connection and contract creation:

- **Wallet Integration**: MetaMask and WalletConnect support
- **Network Switching**: Automatic Yellow Network configuration
- **Form Validation**: Real-time validation of contract parameters
- **Transaction Tracking**: Progress indicators and confirmations
- **Error Handling**: User-friendly error messages

## Testing

### Unit Tests

Run comprehensive contract tests:

```bash
npx hardhat test
```

### Test Coverage

- ✅ Contract creation and validation
- ✅ Tenant signing with security deposit
- ✅ Rent payment processing
- ✅ Contract termination scenarios
- ✅ Platform fee calculations
- ✅ Access control and permissions
- ✅ Edge cases and error conditions

### Integration Tests

Test the complete flow from frontend to blockchain:

1. Property listing with rental option
2. Contract creation via UI
3. Tenant wallet connection and signing
4. Monthly rent payment automation
5. Contract termination and deposit return

## Security Considerations

### Smart Contract Security

- **Reentrancy Protection**: All payable functions use ReentrancyGuard
- **Access Control**: Ownable pattern for administrative functions
- **Input Validation**: Comprehensive parameter validation
- **Integer Overflow**: Using Solidity 0.8+ built-in protection

### Frontend Security

- **Wallet Validation**: Verify connected wallet addresses
- **Network Verification**: Ensure correct network connection
- **Transaction Signing**: User confirmation for all transactions
- **Error Handling**: Safe error reporting without sensitive data exposure

## Gas Optimization

### Contract Deployment
- **Estimated Gas**: ~2,500,000 gas units
- **Deployment Cost**: ~0.05 YEL (Yellow Network)

### Function Calls
- **Create Contract**: ~300,000 gas
- **Sign Contract**: ~150,000 gas
- **Pay Rent**: ~100,000 gas
- **Query Contract**: ~50,000 gas (view function)

## Monitoring and Analytics

### Event Monitoring

Track contract events for analytics:

```typescript
// Listen for contract creation events
contract.on('ContractCreated', (contractId, propertyId, landlord, tenant) => {
  console.log(`New rental contract ${contractId} created for property ${propertyId}`);
});

// Listen for rent payments
contract.on('RentPaid', (contractId, amount, month) => {
  console.log(`Rent payment of ${ethers.formatEther(amount)} YEL for contract ${contractId}`);
});
```

### Dashboard Metrics

- Total contracts created
- Active rental agreements
- Monthly rent volume
- Platform fee collection
- Contract termination rates

## Roadmap

### Phase 1 (Current)
- ✅ Basic rental contract implementation
- ✅ Yellow Network integration
- ✅ Frontend contract creation
- ✅ Payment processing

### Phase 2 (Upcoming)
- 🔄 Automated rent reminders
- 🔄 Dispute resolution system
- 🔄 Insurance integration
- 🔄 Multi-signature wallet support

### Phase 3 (Future)
- ⏳ DAO governance for platform decisions
- ⏳ Cross-chain rental contracts
- ⏳ NFT-based property ownership
- ⏳ DeFi yield farming for deposits

## Support

For technical issues or questions:

- **Documentation**: See `/docs` folder
- **Contract Issues**: Check Yellow Network Explorer
- **Frontend Issues**: Check browser console and network tab
- **Gas Issues**: Verify YEL token balance

## License

This smart contract implementation is released under the MIT License. See LICENSE file for details.