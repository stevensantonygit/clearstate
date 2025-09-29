import { ethers } from 'ethers';
import { RentalContract, SmartContractParams } from '@/types';

// Load deployment info
import deploymentInfo from '../../deployment-info.json';

// Yellow Network ERC-7824 compliant rental contract ABI (from deployment)
const RENTAL_CONTRACT_ABI = deploymentInfo.abi;

// Yellow Network testnet configuration
const YELLOW_NETWORK_CONFIG = {
  chainId: 0x2711, // 10001 in hex - Yellow Network testnet chain ID
  name: 'Yellow Network Testnet',
  currency: 'YEL',
  rpcUrl: 'https://rpc.testnet.yellow.org',
  explorerUrl: 'https://explorer.testnet.yellow.org',
  contractAddress: deploymentInfo.contractAddress || '0x0000000000000000000000000000000000000000'
};

class SmartContractService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private contract: ethers.Contract | null = null;

  async initialize() {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask or compatible wallet not found');
    }

    try {
      // Request wallet connection
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Switch to Yellow Network if not already connected
      await this.switchToYellowNetwork();

      // Initialize provider and signer
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      
      // Initialize contract
      this.contract = new ethers.Contract(
        YELLOW_NETWORK_CONFIG.contractAddress,
        RENTAL_CONTRACT_ABI,
        this.signer
      );

      return true;
    } catch (error) {
      console.error('Failed to initialize smart contract service:', error);
      throw error;
    }
  }

  async switchToYellowNetwork() {
    if (!window.ethereum) return;

    try {
      // Try to switch to Yellow Network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${YELLOW_NETWORK_CONFIG.chainId.toString(16)}` }],
      });
    } catch (switchError: any) {
      // If network doesn't exist, add it
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${YELLOW_NETWORK_CONFIG.chainId.toString(16)}`,
            chainName: YELLOW_NETWORK_CONFIG.name,
            nativeCurrency: {
              name: YELLOW_NETWORK_CONFIG.currency,
              symbol: YELLOW_NETWORK_CONFIG.currency,
              decimals: 18
            },
            rpcUrls: [YELLOW_NETWORK_CONFIG.rpcUrl],
            blockExplorerUrls: [YELLOW_NETWORK_CONFIG.explorerUrl]
          }]
        });
      } else {
        throw switchError;
      }
    }
  }

  async createRentalContract(params: SmartContractParams): Promise<{ contractId: string; transactionHash: string }> {
    if (!this.contract || !this.signer) {
      await this.initialize();
    }

    try {
      console.log('Creating rental contract with params:', params);

      const tx = await this.contract!.createRentalAgreement(
        params.propertyId,
        params.tenant,
        ethers.parseEther(params.monthlyRent),
        ethers.parseEther(params.securityDeposit),
        params.leaseDuration,
        params.contractTerms
      );

      console.log('Transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);

      // Extract contract ID from event logs
      const contractCreatedEvent = receipt.logs.find((log: any) => 
        log.fragment?.name === 'ContractCreated'
      );
      
      const contractId = contractCreatedEvent?.args[0]?.toString() || '0';

      return {
        contractId,
        transactionHash: tx.hash
      };
    } catch (error) {
      console.error('Failed to create rental contract:', error);
      throw error;
    }
  }

  async signContract(contractId: string): Promise<string> {
    if (!this.contract) {
      await this.initialize();
    }

    try {
      console.log('Signing contract:', contractId);

      const tx = await this.contract!.signContract(contractId);
      console.log('Transaction sent:', tx.hash);
      
      await tx.wait();
      console.log('Contract signed successfully');

      return tx.hash;
    } catch (error) {
      console.error('Failed to sign contract:', error);
      throw error;
    }
  }

  async getContract(contractId: string): Promise<any> {
    if (!this.contract) {
      await this.initialize();
    }

    try {
      const contractData = await this.contract!.getContract(contractId);
      return {
        propertyId: contractData[0],
        landlord: contractData[1],
        tenant: contractData[2],
        monthlyRent: ethers.formatEther(contractData[3]),
        securityDeposit: ethers.formatEther(contractData[4]),
        leaseDuration: contractData[5].toString(),
        contractTerms: contractData[6],
        status: contractData[7],
        createdAt: new Date(Number(contractData[8]) * 1000)
      };
    } catch (error) {
      console.error('Failed to get contract:', error);
      throw error;
    }
  }

  async payRent(contractId: string, amount: string): Promise<string> {
    if (!this.contract) {
      await this.initialize();
    }

    try {
      console.log('Paying rent for contract:', contractId, 'Amount:', amount);

      const tx = await this.contract!.payRent(contractId, {
        value: ethers.parseEther(amount)
      });
      
      console.log('Transaction sent:', tx.hash);
      await tx.wait();
      console.log('Rent paid successfully');

      return tx.hash;
    } catch (error) {
      console.error('Failed to pay rent:', error);
      throw error;
    }
  }

  async getWalletAddress(): Promise<string> {
    if (!this.signer) {
      await this.initialize();
    }
    return await this.signer!.getAddress();
  }

  formatEther(value: string): string {
    return ethers.formatEther(value);
  }

  parseEther(value: string): bigint {
    return ethers.parseEther(value);
  }
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}

export const smartContractService = new SmartContractService();
export default smartContractService;