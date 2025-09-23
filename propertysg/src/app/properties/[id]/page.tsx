"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Property } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Eye,
  Phone,
  Mail,
  MessageSquare,
  Wifi,
  Car,
  Dumbbell,
  Waves,
  Shield,
  TreePine
} from "lucide-react"

// Mock data for the property details
const mockProperty: Property = {
  id: "1",
  title: "Modern 3-Bedroom HDB Flat in Toa Payoh",
  description: "This beautifully renovated HDB flat offers modern living in the heart of Toa Payoh. The unit features an open-concept living and dining area, upgraded kitchen with modern appliances, and three well-appointed bedrooms. Located in a mature estate with excellent connectivity to the city center via multiple MRT lines. The building is well-maintained with recent upgrading works completed. Perfect for families looking for a comfortable home in an established neighborhood with great amenities nearby.",
  price: 650000,
  location: {
    address: "Block 123 Toa Payoh Lorong 1",
    district: "Toa Payoh",
    postalCode: "310123"
  },
  propertyType: "hdb",
  bedrooms: 3,
  bathrooms: 2,
  area: 1000,
  images: [
    "/placeholder-property.jpg",
    "/placeholder-property.jpg",
    "/placeholder-property.jpg",
    "/placeholder-property.jpg"
  ],
  amenities: ["Near MRT", "Upgraded Kitchen", "Air Conditioning", "Renovated", "High Floor"],
  owner: {
    name: "John Tan",
    contactNumber: "+65 9123 4567",
    email: "john@example.com",
    userId: "owner1"
  },
  ownerName: "John Tan",
  ownerPhone: "+65 9123 4567",
  furnishing: "fully-furnished",
  tenure: "leasehold-99",
  availability: "Immediate",
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
  status: "available",
  featured: true,
  views: 245
}

const amenityIcons: { [key: string]: any } = {
  "Near MRT": MapPin,
  "Upgraded Kitchen": Car,
  "Air Conditioning": Wifi,
  "Pool": Waves,
  "Gym": Dumbbell,
  "Security": Shield,
  "Garden": TreePine,
  "Parking": Car,
  "Renovated": Shield,
  "High Floor": Shield
}

export default function PropertyDetailsPage() {
  const params = useParams()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)

  useEffect(() => {
    // Simulate loading property data
    const timer = setTimeout(() => {
      setProperty(mockProperty)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [params.id])

  const handleFavorite = () => {
    setIsFavorited(!isFavorited)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD',
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <div className="container px-4 py-8 md:px-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="container px-4 py-8 md:px-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/properties">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Properties
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 md:px-6">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/properties">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Properties
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative h-96 w-full overflow-hidden rounded-lg">
              <Image
                src={property.images[currentImageIndex]}
                alt={property.title}
                fill
                className="object-cover"
              />
              {property.featured && (
                <Badge className="absolute top-4 left-4 bg-yellow-500 text-yellow-900">
                  Featured
                </Badge>
              )}
            </div>
            {property.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 ${
                      currentImageIndex === index 
                        ? "border-primary" 
                        : "border-transparent"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${property.title} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="space-y-6">
            {/* Title and Actions */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">{property.title}</h1>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{property.location.address}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    <span>{property.views} views</span>
                  </div>
                  <span>Listed on {property.createdAt.toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleFavorite}
                >
                  <Heart 
                    className={`h-4 w-4 ${
                      isFavorited 
                        ? "fill-red-500 text-red-500" 
                        : "text-gray-600"
                    }`} 
                  />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Key Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="flex items-center justify-center p-6">
                  <div className="text-center">
                    <Badge variant="outline" className="mb-2">
                      {property.propertyType}
                    </Badge>
                    <div className="text-sm text-muted-foreground">Type</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center justify-center p-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Bed className="h-5 w-5 mr-1" />
                      <span className="font-semibold">{property.bedrooms}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Bedrooms</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center justify-center p-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Bath className="h-5 w-5 mr-1" />
                      <span className="font-semibold">{property.bathrooms}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Bathrooms</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center justify-center p-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Square className="h-5 w-5 mr-1" />
                      <span className="font-semibold">{property.area}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">sqft</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Property</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {property.description}
                </p>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>Amenities & Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((amenity) => {
                    const IconComponent = amenityIcons[amenity] || Shield
                    return (
                      <div key={amenity} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                        <IconComponent className="h-4 w-4 text-primary" />
                        <span className="text-sm">{amenity}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price and Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-primary">
                {formatPrice(property.price)}
              </CardTitle>
              <Badge variant="outline" className="w-fit">
                {property.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {property.ownerName?.charAt(0) || property.owner?.name?.charAt(0) || 'O'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{property.ownerName || property.owner?.name || 'Owner'}</div>
                  <div className="text-sm text-muted-foreground">Property Agent</div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <Button className="w-full gap-2">
                  <Phone className="h-4 w-4" />
                  Call {property.ownerPhone}
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <MessageSquare className="h-4 w-4" />
                  WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div><strong>Address:</strong> {property.location.address}</div>
                <div><strong>District:</strong> {property.location.district}</div>
                <div><strong>Postal Code:</strong> {property.location.postalCode}</div>
              </div>
              <div className="h-48 bg-muted rounded-md flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-8 w-8 mx-auto mb-2" />
                  <div>Map integration would go here</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
