"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Property } from "@/types"
import { propertyService } from "@/lib/property-service"
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

const amenityIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
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

interface Props {
  propertyId: string
}

export default function PropertyDetailsClient({ propertyId }: Props) {
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true)
        setError(null)
        
        console.log('PropertyDetailsClient: Fetching property with ID:', propertyId)
        
        // Fetch all properties and find the one with matching ID
        const properties = await propertyService.getAllProperties()
        console.log('PropertyDetailsClient: All properties:', properties)
        
        const foundProperty = properties.find(p => p.id === propertyId)
        console.log('PropertyDetailsClient: Found property:', foundProperty)
        
        if (foundProperty) {
          setProperty(foundProperty)
        } else {
          setError(`Property with ID ${propertyId} not found`)
        }
      } catch (err) {
        console.error('PropertyDetailsClient: Error fetching property:', err)
        setError('Failed to fetch property')
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [propertyId])

  if (loading) {
    return (
      <div className="container px-4 py-8 md:px-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading property details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container px-4 py-8 md:px-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
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

  if (!property) {
    return (
      <div className="container px-4 py-8 md:px-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The property you&apos;re looking for doesn&apos;t exist or has been removed.
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/properties">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Properties
            </Button>
          </Link>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{property.title}</h1>
              <p className="text-muted-foreground flex items-center mt-2">
                <MapPin className="h-4 w-4 mr-1" />
                {property.location.address}, {property.location.district}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">S${property.price.toLocaleString()}</p>
              <Badge variant="secondary" className="mt-2">
                {property.propertyType.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <Card className="mb-6">
              <CardContent className="p-0">
                <div className="relative h-96 mb-4">
                  <Image
                    src={property.images[currentImageIndex]}
                    alt={property.title}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-4 gap-2">
                    {property.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative h-20 rounded-md overflow-hidden border-2 ${
                          index === currentImageIndex ? 'border-primary' : 'border-muted'
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
                </div>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <Bed className="h-6 w-6 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Bedrooms</p>
                    <p className="font-semibold">{property.bedrooms}</p>
                  </div>
                  <div className="text-center">
                    <Bath className="h-6 w-6 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Bathrooms</p>
                    <p className="font-semibold">{property.bathrooms}</p>
                  </div>
                  <div className="text-center">
                    <Square className="h-6 w-6 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Area</p>
                    <p className="font-semibold">{property.area} sqft</p>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Furnishing:</span>
                    <span className="ml-2 font-medium">{property.furnishing}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tenure:</span>
                    <span className="ml-2 font-medium">{property.tenure}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Availability:</span>
                    <span className="ml-2 font-medium">{property.availability}</span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    <span>{property.views} views</span>
                  </div>
                  <span>Listed on {property.createdAt instanceof Date ? property.createdAt.toLocaleDateString() : 'Recently'}</span>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Description</CardTitle>
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <Button 
                    variant={isFavorited ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setIsFavorited(!isFavorited)}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isFavorited ? 'fill-current' : ''}`} />
                    {isFavorited ? 'Saved' : 'Save Property'}
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Property
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Agent Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Agent</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>{property.owner.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{property.owner.name}</p>
                    <p className="text-sm text-muted-foreground">Property Agent</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button variant="default" className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    Call {property.owner.contactNumber}
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Agent
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Property Type</span>
                    <span className="font-medium">{property.propertyType.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant="outline">{property.status}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Featured</span>
                    <span className="font-medium">{property.featured ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}