// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RentalContract
 * @dev ERC-7824 compliant rental agreement smart contract for Yellow Network
 * @author PropertySG Team
 * 
 * This contract implements the ERC-7824 standard for property rental agreements
 * providing automated rent collection, security deposit management, and 
 * transparent lease terms execution.
 */
contract RentalContract is ReentrancyGuard, Ownable {
    
    enum ContractStatus { PENDING, SIGNED, ACTIVE, EXPIRED, TERMINATED }
    
    struct RentalAgreement {
        string propertyId;
        address landlord;
        address tenant;
        uint256 monthlyRent;
        uint256 securityDeposit;
        uint256 leaseDuration; // in seconds
        string contractTerms;
        ContractStatus status;
        uint256 createdAt;
        uint256 startDate;
        uint256 endDate;
        uint256 lastRentPayment;
        bool securityDepositPaid;
    }
    
    mapping(uint256 => RentalAgreement) public contracts;
    mapping(address => uint256[]) public landlordContracts;
    mapping(address => uint256[]) public tenantContracts;
    
    uint256 public nextContractId = 1;
    uint256 public platformFee = 100; // 1% in basis points
    address public platformWallet;
    
    event ContractCreated(
        uint256 indexed contractId, 
        string propertyId, 
        address indexed landlord, 
        address indexed tenant
    );
    
    event ContractSigned(uint256 indexed contractId, address indexed signer);
    event RentPaid(uint256 indexed contractId, uint256 amount, uint256 month);
    event SecurityDepositPaid(uint256 indexed contractId, uint256 amount);
    event ContractTerminated(uint256 indexed contractId, address terminatedBy);
    event SecurityDepositReturned(uint256 indexed contractId, uint256 amount);
    
    constructor(address _platformWallet) {
        platformWallet = _platformWallet;
    }
    
    /**
     * @dev Creates a new rental agreement
     * @param propertyId Unique identifier for the property
     * @param tenant Address of the tenant
     * @param monthlyRent Monthly rent amount in wei
     * @param securityDeposit Security deposit amount in wei
     * @param leaseDuration Lease duration in seconds
     * @param contractTerms IPFS hash or string containing contract terms
     */
    function createRentalAgreement(
        string memory propertyId,
        address tenant,
        uint256 monthlyRent,
        uint256 securityDeposit,
        uint256 leaseDuration,
        string memory contractTerms
    ) external returns (uint256) {
        require(tenant != address(0), "Invalid tenant address");
        require(tenant != msg.sender, "Landlord cannot be tenant");
        require(monthlyRent > 0, "Monthly rent must be greater than 0");
        require(securityDeposit > 0, "Security deposit must be greater than 0");
        require(leaseDuration > 0, "Lease duration must be greater than 0");
        
        uint256 contractId = nextContractId++;
        
        contracts[contractId] = RentalAgreement({
            propertyId: propertyId,
            landlord: msg.sender,
            tenant: tenant,
            monthlyRent: monthlyRent,
            securityDeposit: securityDeposit,
            leaseDuration: leaseDuration,
            contractTerms: contractTerms,
            status: ContractStatus.PENDING,
            createdAt: block.timestamp,
            startDate: 0,
            endDate: 0,
            lastRentPayment: 0,
            securityDepositPaid: false
        });
        
        landlordContracts[msg.sender].push(contractId);
        tenantContracts[tenant].push(contractId);
        
        emit ContractCreated(contractId, propertyId, msg.sender, tenant);
        
        return contractId;
    }
    
    /**
     * @dev Allows tenant to sign the contract and pay security deposit
     * @param contractId The contract ID to sign
     */
    function signContract(uint256 contractId) external payable nonReentrant {
        RentalAgreement storage agreement = contracts[contractId];
        require(agreement.landlord != address(0), "Contract does not exist");
        require(msg.sender == agreement.tenant, "Only tenant can sign");
        require(agreement.status == ContractStatus.PENDING, "Contract not in pending status");
        require(msg.value >= agreement.securityDeposit, "Insufficient security deposit");
        
        agreement.status = ContractStatus.SIGNED;
        agreement.startDate = block.timestamp;
        agreement.endDate = block.timestamp + agreement.leaseDuration;
        agreement.securityDepositPaid = true;
        
        // Calculate platform fee
        uint256 fee = (msg.value * platformFee) / 10000;
        uint256 depositAmount = msg.value - fee;
        
        // Transfer platform fee
        if (fee > 0) {
            payable(platformWallet).transfer(fee);
        }
        
        emit ContractSigned(contractId, msg.sender);
        emit SecurityDepositPaid(contractId, depositAmount);
    }
    
    /**
     * @dev Allows tenant to pay monthly rent
     * @param contractId The contract ID for rent payment
     */
    function payRent(uint256 contractId) external payable nonReentrant {
        RentalAgreement storage agreement = contracts[contractId];
        require(agreement.landlord != address(0), "Contract does not exist");
        require(msg.sender == agreement.tenant, "Only tenant can pay rent");
        require(agreement.status == ContractStatus.SIGNED, "Contract not active");
        require(block.timestamp <= agreement.endDate, "Contract expired");
        require(msg.value >= agreement.monthlyRent, "Insufficient rent payment");
        
        // Calculate platform fee
        uint256 fee = (msg.value * platformFee) / 10000;
        uint256 rentAmount = msg.value - fee;
        
        // Transfer rent to landlord
        payable(agreement.landlord).transfer(rentAmount);
        
        // Transfer platform fee
        if (fee > 0) {
            payable(platformWallet).transfer(fee);
        }
        
        agreement.lastRentPayment = block.timestamp;
        
        emit RentPaid(contractId, rentAmount, getCurrentMonth(contractId));
    }
    
    /**
     * @dev Terminates the contract (can be called by landlord or tenant)
     * @param contractId The contract ID to terminate
     */
    function terminateContract(uint256 contractId) external nonReentrant {
        RentalAgreement storage agreement = contracts[contractId];
        require(agreement.landlord != address(0), "Contract does not exist");
        require(
            msg.sender == agreement.landlord || msg.sender == agreement.tenant,
            "Only landlord or tenant can terminate"
        );
        require(agreement.status == ContractStatus.SIGNED, "Contract not active");
        
        agreement.status = ContractStatus.TERMINATED;
        
        // Return security deposit to tenant (simplified - in real contract, you'd have damage assessment)
        if (agreement.securityDepositPaid && address(this).balance >= agreement.securityDeposit) {
            payable(agreement.tenant).transfer(agreement.securityDeposit);
            agreement.securityDepositPaid = false;
            emit SecurityDepositReturned(contractId, agreement.securityDeposit);
        }
        
        emit ContractTerminated(contractId, msg.sender);
    }
    
    /**
     * @dev Gets contract details
     * @param contractId The contract ID to query
     */
    function getContract(uint256 contractId) external view returns (RentalAgreement memory) {
        require(contracts[contractId].landlord != address(0), "Contract does not exist");
        return contracts[contractId];
    }
    
    /**
     * @dev Gets contracts by landlord
     * @param landlord The landlord address
     */
    function getContractsByLandlord(address landlord) external view returns (uint256[] memory) {
        return landlordContracts[landlord];
    }
    
    /**
     * @dev Gets contracts by tenant
     * @param tenant The tenant address
     */
    function getContractsByTenant(address tenant) external view returns (uint256[] memory) {
        return tenantContracts[tenant];
    }
    
    /**
     * @dev Gets current month of the lease
     * @param contractId The contract ID
     */
    function getCurrentMonth(uint256 contractId) public view returns (uint256) {
        RentalAgreement storage agreement = contracts[contractId];
        if (agreement.startDate == 0) return 0;
        
        uint256 elapsed = block.timestamp - agreement.startDate;
        return (elapsed / 30 days) + 1; // Simplified month calculation
    }
    
    /**
     * @dev Updates platform fee (only owner)
     * @param newFee New platform fee in basis points
     */
    function updatePlatformFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee cannot exceed 10%"); // Maximum 10%
        platformFee = newFee;
    }
    
    /**
     * @dev Updates platform wallet (only owner)
     * @param newWallet New platform wallet address
     */
    function updatePlatformWallet(address newWallet) external onlyOwner {
        require(newWallet != address(0), "Invalid wallet address");
        platformWallet = newWallet;
    }
    
    /**
     * @dev Emergency withdraw function (only owner)
     */
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    /**
     * @dev Fallback function to receive Ether
     */
    receive() external payable {}
}