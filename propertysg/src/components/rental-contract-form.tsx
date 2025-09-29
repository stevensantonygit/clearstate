"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "./ui/alert"
import { Separator } from "@/components/ui/separator"
import { 
  FileText, 
  Wallet, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  DollarSign,
  Calendar,
  Shield,
  ExternalLink
} from "lucide-react"
import { Property, RentalContract, SmartContractParams } from "@/types"
import yellowRentalService from "@/lib/yellow-rental-service"
import { toast } from "sonner"

interface RentalContractFormProps {
  property: Property
  onContractCreated?: (contract: RentalContract) => void
}

export function RentalContractForm({ property, onContractCreated }: RentalContractFormProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [contractData, setContractData] = useState({
    tenantAddress: "",
    monthlyRent: property.price.toString(),
    securityDeposit: (property.price * 2).toString(), // 2 months security deposit
    leaseDuration: "12", // 12 months default
    contractTerms: ""
  })
  const [createdContract, setCreatedContract] = useState<{
    contractId: string;
    transactionHash: string;
  } | null>(null)

  useEffect(() => {
    checkWalletConnection()
  }, [])

  const checkWalletConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          setIsConnected(true)
          setWalletAddress(accounts[0])
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error)
      }
    }
  }

  const connectWallet = async () => {
    try {
      const result = await yellowRentalService.initialize()
      setWalletAddress(result.address)
      setIsConnected(true)
      toast.success(`Connected to ${result.network}!`)
    } catch (error) {
      console.error('Error connecting wallet:', error)
      toast.error("Failed to connect wallet. Please make sure MetaMask is installed.")
    }
  }

  const createContract = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first")
      return
    }

    if (!contractData.tenantAddress) {
      toast.error("Please enter tenant's wallet address")
      return
    }

    if (!contractData.contractTerms) {
      toast.error("Please enter contract terms")
      return
    }

    setIsCreating(true)

    try {
      const contractParams: SmartContractParams = {
        propertyId: property.id || "",
        landlord: walletAddress,
        tenant: contractData.tenantAddress,
        tenantAddress: contractData.tenantAddress,
        monthlyRent: contractData.monthlyRent,
        securityDeposit: contractData.securityDeposit,
        leaseDuration: parseInt(contractData.leaseDuration) * 30 * 24 * 60 * 60, // Convert months to seconds
        contractTerms: contractData.contractTerms
      }

      console.log('Creating contract with params:', contractParams)

      const result = await yellowRentalService.createRentalContract(contractParams)
      
      setCreatedContract(result)
      toast.success("Yellow Network rental contract created successfully!")

      // Create rental contract record for database
      const rentalContract: RentalContract = {
        id: result.contractId,
        propertyId: property.id || "",
        landlordAddress: walletAddress,
        tenantAddress: contractData.tenantAddress,
        monthlyRent: parseFloat(contractData.monthlyRent),
        securityDeposit: parseFloat(contractData.securityDeposit),
        leaseDuration: parseInt(contractData.leaseDuration),
        startDate: new Date(),
        endDate: new Date(Date.now() + parseInt(contractData.leaseDuration) * 30 * 24 * 60 * 60 * 1000),
        contractTerms: contractData.contractTerms,
        status: 'pending',
        transactionHash: result.transactionHash,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      onContractCreated?.(rentalContract)

    } catch (error) {
      console.error('Error creating contract:', error)
      toast.error("Failed to create smart contract. Please try again.")
    } finally {
      setIsCreating(false)
    }
  }

  const defaultContractTerms = `RENTAL AGREEMENT FOR ${property.title}

Property Details:
- Address: ${property.location.address}
- Property Type: ${property.propertyType.toUpperCase()}
- Bedrooms: ${property.bedrooms}
- Bathrooms: ${property.bathrooms}
- Area: ${property.area} sqft

Terms and Conditions:
1. Monthly Rent: S$${contractData.monthlyRent}
2. Security Deposit: S$${contractData.securityDeposit}
3. Lease Duration: ${contractData.leaseDuration} months
4. The tenant agrees to pay rent by the 1st of each month
5. The security deposit will be returned upon satisfactory completion of lease
6. The property must be maintained in good condition
7. No subletting without landlord's written consent
8. Notice period for termination: 2 months
9. Any damages beyond normal wear and tear will be deducted from security deposit
10. This agreement is governed by Singapore law

Smart Contract Details:
- Blockchain: Yellow Network (ERC-7824 compliant)
- Automated rent collection and escrow
- Transparent and immutable terms
- Instant settlement upon agreement completion`

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Create Smart Rental Contract
            <Badge variant="outline" className="ml-2">Yellow Network</Badge>
          </CardTitle>
          <p className="text-muted-foreground">
            Create a blockchain-based rental agreement using Yellow Network's ERC-7824 standard for secure, transparent property rentals.
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Property Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Property Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Property</Label>
              <p className="text-sm text-muted-foreground">{property.title}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Address</Label>
              <p className="text-sm text-muted-foreground">{property.location.address}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Type</Label>
                <p className="text-sm text-muted-foreground capitalize">{property.propertyType}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Area</Label>
                <p className="text-sm text-muted-foreground">{property.area} sqft</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Bedrooms</Label>
                <p className="text-sm text-muted-foreground">{property.bedrooms}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Bathrooms</Label>
                <p className="text-sm text-muted-foreground">{property.bathrooms}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wallet Connection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Wallet Connection
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isConnected ? (
              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Connect your wallet to create smart contracts on Yellow Network
                  </AlertDescription>
                </Alert>
                <Button onClick={connectWallet} className="w-full">
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect Wallet
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Wallet connected successfully
                  </AlertDescription>
                </Alert>
                <div>
                  <Label className="text-sm font-medium">Your Address</Label>
                  <p className="text-sm text-muted-foreground font-mono break-all">
                    {walletAddress}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Contract Form */}
      {isConnected && !createdContract && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contract Details</CardTitle>
            <p className="text-sm text-muted-foreground">
              Configure the rental agreement parameters
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tenantAddress">Tenant Wallet Address *</Label>
                <Input
                  id="tenantAddress"
                  placeholder="0x..."
                  value={contractData.tenantAddress}
                  onChange={(e) => setContractData(prev => ({ ...prev, tenantAddress: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="leaseDuration">Lease Duration (Months) *</Label>
                <Input
                  id="leaseDuration"
                  type="number"
                  min="1"
                  max="60"
                  value={contractData.leaseDuration}
                  onChange={(e) => setContractData(prev => ({ ...prev, leaseDuration: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="monthlyRent">Monthly Rent (SGD) *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="monthlyRent"
                    type="number"
                    className="pl-9"
                    value={contractData.monthlyRent}
                    onChange={(e) => setContractData(prev => ({ ...prev, monthlyRent: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="securityDeposit">Security Deposit (SGD) *</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="securityDeposit"
                    type="number"
                    className="pl-9"
                    value={contractData.securityDeposit}
                    onChange={(e) => setContractData(prev => ({ ...prev, securityDeposit: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="contractTerms">Contract Terms *</Label>
              <Textarea
                id="contractTerms"
                rows={12}
                placeholder="Enter detailed rental terms and conditions..."
                value={contractData.contractTerms || defaultContractTerms}
                onChange={(e) => setContractData(prev => ({ ...prev, contractTerms: e.target.value }))}
              />
            </div>

            <Separator />

            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button
                onClick={() => setContractData(prev => ({ ...prev, contractTerms: defaultContractTerms }))}
                variant="outline"
              >
                Load Default Terms
              </Button>
              <Button
                onClick={createContract}
                disabled={isCreating}
                className="min-w-[160px]"
              >
                {isCreating ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Create Contract
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success State */}
      {createdContract && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-lg text-green-800 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Smart Contract Created Successfully!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Contract ID</Label>
                <p className="text-sm font-mono text-muted-foreground">{createdContract.contractId}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Transaction Hash</Label>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-mono text-muted-foreground truncate">
                    {createdContract.transactionHash}
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(`https://explorer.yellowstone.yellownetwork.io/tx/${createdContract.transactionHash}`, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                The contract has been created and is pending tenant signature. Share the contract ID with your tenant so they can sign and activate the rental agreement.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary">ERC-7824 Compliant</Badge>
              <Badge variant="secondary">Yellow Network</Badge>
              <Badge variant="secondary">Pending Signature</Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}