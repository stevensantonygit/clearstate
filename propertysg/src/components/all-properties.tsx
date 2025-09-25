"use client"

import { useState, useEffect } from "react"
import { Property } from "@/types"
import { propertyService } from "@/lib/property-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Eye,
  Heart,
  Phone,
  Mail,
  Filter,
  Search,
  Calendar,
  DollarSign,
  Home,
  Building,
  Building2,
  Warehouse
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const propertyTypeIcons = {
  hdb: Home,
  condo: Building,
  landed: Building2,
  commercial: Warehouse
}

export function AllProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    fetchAllProperties()
  }, [])

  useEffect(() => {
    filterAndSortProperties()
  }, [properties, searchQuery, filterType, filterStatus, sortBy])

  const fetchAllProperties = async () => {
    try {
      console.log("🔥 Starting to fetch properties from Firebase...")
      setLoading(true)
      const allProperties = await propertyService.getAllProperties()
      console.log("🔥 Fetched properties:", allProperties)
      console.log("🔥 Number of properties:", allProperties.length)
      setProperties(allProperties)
    } catch (error) {
      console.error("❌ Error fetching properties:", error)
      setProperties([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortProperties = () => {
    let filtered = [...properties]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.district.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply property type filter
    if (filterType !== "all") {
      filtered = filtered.filter(property => property.propertyType === filterType)
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(property => property.status === filterStatus)
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => {
          const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : 0
          const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : 0
          return bTime - aTime
        })
        break
      case "oldest":
        filtered.sort((a, b) => {
          const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : 0
          const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : 0
          return aTime - bTime
        })
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "views":
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0))
        break
    }

    setFilteredProperties(filtered)
  }

  const formatPrice = (price: number, propertyType: string) => {
    if (propertyType === "commercial") {
      return `S$${price.toLocaleString()}/month`
    }
    return `S$${price.toLocaleString()}`
  }

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('en-SG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">All Properties</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">All Properties</h1>
          <p className="text-muted-foreground">
            Browse all {filteredProperties.length} properties in our database
          </p>
        </div>
        <Badge variant="secondary" className="w-fit">
          Total: {properties.length} Properties
        </Badge>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Property Type Filter */}
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="hdb">HDB</SelectItem>
                <SelectItem value="condo">Condo</SelectItem>
                <SelectItem value="landed">Landed</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="rented">Rented</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="views">Most Viewed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Properties Grid */}
      {filteredProperties.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No properties found</h3>
            <p className="text-muted-foreground text-center">
              Try adjusting your search criteria or filters to find more properties.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.map((property) => {
            const PropertyTypeIcon = propertyTypeIcons[property.propertyType] || Home
            
            return (
              <Card key={property.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                {/* Property Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={property.images[0]}
                    alt={property.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {property.featured && (
                    <Badge className="absolute top-3 left-3 bg-yellow-500 text-yellow-900">
                      Featured
                    </Badge>
                  )}
                  <Badge 
                    variant="secondary" 
                    className="absolute top-3 right-3 bg-white/90 text-gray-900"
                  >
                    {property.status}
                  </Badge>
                  
                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white" asChild>
                        <Link href={`/properties/${property.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>

                <CardContent className="p-4">
                  {/* Property Title and Type */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg line-clamp-2 mb-1">
                        {property.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <PropertyTypeIcon className="h-4 w-4" />
                        <span className="capitalize">{property.propertyType}</span>
                        {property.tenure && (
                          <>
                            <span>•</span>
                            <span className="capitalize">{property.tenure.replace('-', ' ')}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="line-clamp-1">{property.location.address}</span>
                  </div>

                  {/* Property Details */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    {property.bedrooms > 0 && (
                      <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        <span>{property.bedrooms}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Bath className="h-4 w-4" />
                      <span>{property.bathrooms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Square className="h-4 w-4" />
                      <span>{property.area} sqft</span>
                    </div>
                    {property.views && (
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{property.views}</span>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <span className="text-2xl font-bold text-green-600">
                        {formatPrice(property.price, property.propertyType)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{property.createdAt instanceof Date ? formatDate(property.createdAt) : 'Recently'}</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {property.amenities.slice(0, 3).map((amenity) => (
                        <Badge key={amenity} variant="outline" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                      {property.amenities.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{property.amenities.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Separator className="mb-4" />

                  {/* Owner Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-sm">
                          {property.owner.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{property.owner.name}</p>
                        <p className="text-xs text-muted-foreground">Owner</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}