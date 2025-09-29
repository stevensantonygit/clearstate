// Firebase Test Component - Add this to verify Firebase connection
"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { propertyService, Property } from '@/lib/property-service'
import { useAuth } from '@/contexts/auth-context'
import { toast } from 'sonner'

export function FirebaseTest() {
  const [testing, setTesting] = useState(false)
  const [properties, setProperties] = useState<Property[]>([])
  const { user } = useAuth()

  const testFirebaseConnection = async () => {
    setTesting(true)
    try {
      console.log('Testing Firebase connection...')
      console.log('User:', user)
      
      // Test creating a property
      if (user) {
        const testProperty = {
          title: 'Test Property',
          description: 'This is a test property',
          price: '500000',
          propertyType: 'hdb',
          listingType: 'sale',
          bedrooms: '3',
          bathrooms: '2',
          area: '1000',
          address: '123 Test Street',
          district: 'Test District',
          postalCode: '123456',
          ownerName: 'Test Owner',
          contactNumber: '+65 12345678',
          whatsappNumber: '+65 12345678',
          email: 'test@test.com',
          amenities: ['Swimming Pool', 'Gym'],
          furnishing: 'fully-furnished',
          tenure: 'freehold',
          availability: '2024-01-01'
        }

        console.log('Creating test property...')
        const propertyId = await propertyService.createProperty(testProperty, [], user.uid)
        console.log('Property created with ID:', propertyId)
        toast.success(`Test property created: ${propertyId}`)
      }
      
      // Test fetching properties
      console.log('Fetching all properties...')
      const allProperties = await propertyService.getAllProperties()
      console.log('All properties:', allProperties)
      setProperties(allProperties)
      
      if (user) {
        console.log('Fetching user properties...')
        const userProperties = await propertyService.getUserProperties(user.uid)
        console.log('User properties:', userProperties)
      }
      
    } catch (error: unknown) {
      console.error('Firebase test error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      toast.error(`Firebase test failed: ${errorMessage}`)
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Firebase Connection Test</h3>
      <Button 
        onClick={testFirebaseConnection} 
        disabled={testing}
        className="mb-4"
      >
        {testing ? 'Testing...' : 'Test Firebase Connection'}
      </Button>
      
      {properties.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Properties in Firebase:</h4>
          <pre className="bg-muted p-2 rounded text-xs overflow-auto max-h-40">
            {JSON.stringify(properties, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}