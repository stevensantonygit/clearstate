import { Property } from "@/types"
import PropertyDetailsClient from "@/components/property-details-client"

// Mock property data - this would come from your API/database
const mockProperty: Property = {
  id: "1",
  title: "Luxury 3-Bedroom Condo at Marina Bay",
  description: "Experience luxury living in this stunning 3-bedroom condominium located in the heart of Marina Bay. This modern unit features floor-to-ceiling windows with breathtaking city and marina views, premium finishes throughout, and access to world-class amenities. The open-concept living and dining area is perfect for entertaining, while the master bedroom includes an en-suite bathroom and walk-in closet. Located in a prime location with easy access to shopping, dining, and public transportation.",
  propertyType: "condo",
  price: 2800000,
  bedrooms: 3,
  bathrooms: 2,
  area: 1250,
  location: {
    address: "Marina Bay Residences",
    district: "Marina Bay",
    postalCode: "018956"
  },
  owner: {
    name: "Sarah Johnson",
    contactNumber: "+65 9123 4567",
    email: "sarah.johnson@email.com",
    userId: "user123"
  },
  images: [
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600"
  ],
  amenities: ["Near MRT", "Upgraded Kitchen", "Air Conditioning", "Pool", "Gym", "Security"],
  furnishing: "fully-furnished",
  tenure: "freehold",
  availability: "Immediate",
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
  status: "available",
  featured: true,
  views: 245
}

// Generate static params for build
export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' }, 
    { id: '3' }
  ]
}

interface Props {
  params: { id: string }
}

export default function PropertyDetailsPage({ params }: Props) {
  // In a real app, you would fetch the property data based on params.id
  // For now, we'll use the mock data
  return <PropertyDetailsClient property={mockProperty} />
}