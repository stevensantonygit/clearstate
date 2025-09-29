"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { RentalContractForm } from "@/components/rental-contract-form"
import { Property } from "@/types"
import { propertyService } from "@/lib/property-service"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

export default function CreateContractPage() {
  const searchParams = useSearchParams()
  const propertyId = searchParams.get('propertyId')
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (propertyId) {
      fetchProperty(propertyId)
    } else {
      setError("Property ID is required")
      setLoading(false)
    }
  }, [propertyId])

  const fetchProperty = async (id: string) => {
    try {
      setLoading(true)
      const propertyData = await propertyService.getPropertyById(id)
      if (propertyData) {
        setProperty(propertyData)
      } else {
        setError("Property not found")
      }
    } catch (error) {
      console.error("Error fetching property:", error)
      setError("Failed to load property details")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8">
          <CardContent className="flex items-center space-x-4">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading property details...</span>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8">
          <CardContent className="text-center space-y-4">
            <h2 className="text-xl font-semibold text-red-600">Error</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button asChild>
              <Link href="/properties">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Properties
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href={`/properties/${propertyId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Property
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Smart Rental Contract
          </h1>
          <p className="text-gray-600">
            Generate a blockchain-based rental agreement for secure property rentals
          </p>
        </div>

        {/* Contract Form */}
        <RentalContractForm 
          property={property}
          onContractCreated={(contract) => {
            console.log("Contract created:", contract)
            // You can add additional logic here like saving to database
          }}
        />
      </div>
    </div>
  )
}