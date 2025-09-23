"use client"

import { useState, useEffect } from "react"
import { PropertyGrid } from "@/components/property-grid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Search, Filter, X, SlidersHorizontal } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { propertyService, Property } from "@/lib/property-service"
import { toast } from "sonner"

// Extended mock data for properties page
const mockProperties: Property[] = [
  {
    id: "1",
    title: "Modern 3-Bedroom HDB Flat in Toa Payoh",
    description: "Beautiful renovated HDB flat with modern amenities",
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
    images: ["/placeholder-property.jpg"],
    amenities: ["Near MRT", "Upgraded Kitchen", "Air Conditioning"],
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
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "available",
    featured: true,
    views: 245
  },
  {
    id: "2",
    title: "Luxury Condo with Marina Bay View",
    description: "Stunning condo with panoramic city views",
    price: 2800000,
    location: {
      address: "Marina Bay Suites, 1 Marina Boulevard",
      district: "Marina Bay",
      postalCode: "018980"
    },
    propertyType: "condo",
    bedrooms: 4,
    bathrooms: 3,
    area: 1500,
    images: ["/placeholder-property.jpg"],
    amenities: ["Pool", "Gym", "Concierge", "Parking"],
    owner: {
      name: "Sarah Lim",
      contactNumber: "+65 9234 5678",
      email: "sarah@example.com",
      userId: "owner2"
    },
    ownerName: "Sarah Lim",
    ownerPhone: "+65 9234 5678",
    furnishing: "fully-furnished",
    tenure: "freehold",
    availability: "Immediate",
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "available",
    featured: true,
    views: 189
  },
  {
    id: "3",
    title: "Charming Landed Property in Bukit Timah",
    description: "Beautiful terrace house in prime location",
    price: 3500000,
    location: {
      address: "Bukit Timah Road",
      district: "Bukit Timah",
      postalCode: "259756"
    },
    propertyType: "landed",
    bedrooms: 5,
    bathrooms: 4,
    area: 2200,
    images: ["/placeholder-property.jpg"],
    amenities: ["Garden", "Garage", "Study Room", "Helper's Room"],
    owner: {
      name: "Michael Wong",
      contactNumber: "+65 9345 6789",
      email: "michael@example.com",
      userId: "owner3"
    },
    ownerName: "Michael Wong",
    ownerPhone: "+65 9345 6789",
    furnishing: "partially-furnished",
    tenure: "freehold",
    availability: "Immediate",
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "available",
    featured: true,
    views: 312
  },
  // Add more mock properties...
  {
    id: "4",
    title: "Cozy 2-Bedroom Condo in Orchard",
    description: "Prime location condo with excellent amenities",
    price: 1800000,
    location: {
      address: "Orchard Towers, 400 Orchard Road",
      district: "Orchard",
      postalCode: "238875"
    },
    propertyType: "condo",
    bedrooms: 2,
    bathrooms: 2,
    area: 850,
    images: ["/placeholder-property.jpg"],
    amenities: ["Pool", "Gym", "24/7 Security", "Near Shopping"],
    owner: {
      name: "Lisa Chen",
      contactNumber: "+65 9456 7890",
      email: "lisa@example.com",
      userId: "owner4"
    },
    ownerName: "Lisa Chen",
    ownerPhone: "+65 9456 7890",
    furnishing: "fully-furnished",
    tenure: "leasehold-99",
    availability: "Immediate",
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "available",
    featured: false,
    views: 156
  },
  {
    id: "5",
    title: "Spacious 4-Room HDB in Jurong West",
    description: "Well-maintained HDB flat in established neighbourhood",
    price: 480000,
    location: {
      address: "Block 456 Jurong West Street 41",
      district: "Jurong West",
      postalCode: "640456"
    },
    propertyType: "hdb",
    bedrooms: 3,
    bathrooms: 2,
    area: 950,
    images: ["/placeholder-property.jpg"],
    amenities: ["Near MRT", "Playground", "Market"],
    owner: {
      name: "Ahmad Rahman",
      contactNumber: "+65 9567 8901",
      email: "ahmad@example.com",
      userId: "owner5"
    },
    ownerName: "Ahmad Rahman",
    ownerPhone: "+65 9567 8901",
    furnishing: "partially-furnished",
    tenure: "leasehold-99",
    availability: "Immediate",
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "available",
    featured: false,
    views: 89
  },
  {
    id: "6",
    title: "Executive Condominium in Punggol",
    description: "Modern EC with great facilities and transport links",
    price: 1200000,
    location: {
      address: "Waterway Ridges, 308C Punggol Walk",
      district: "Punggol",
      postalCode: "821308"
    },
    propertyType: "condo",
    bedrooms: 4,
    bathrooms: 3,
    area: 1200,
    images: ["/placeholder-property.jpg"],
    amenities: ["Pool", "Gym", "BBQ Pits", "Tennis Court"],
    owner: {
      name: "David Ng",
      contactNumber: "+65 9678 9012",
      email: "david@example.com",
      userId: "owner6"
    },
    ownerName: "David Ng",
    ownerPhone: "+65 9678 9012",
    furnishing: "fully-furnished",
    tenure: "leasehold-99",
    availability: "Immediate",
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "available",
    featured: false,
    views: 203
  }
]

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [priceRange, setPriceRange] = useState([0, 5000000])
  const [bedrooms, setBedrooms] = useState("")
  const [sortBy, setSortBy] = useState("price-asc")

  useEffect(() => {
    // Simulate loading properties
    const timer = setTimeout(() => {
      setProperties(mockProperties)
      setFilteredProperties(mockProperties)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let filtered = properties

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.district.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by property type
    if (selectedType) {
      filtered = filtered.filter(property => property.propertyType === selectedType)
    }

    // Filter by price range
    filtered = filtered.filter(property => 
      property.price >= priceRange[0] && property.price <= priceRange[1]
    )

    // Filter by bedrooms
    if (bedrooms) {
      filtered = filtered.filter(property => property.bedrooms === parseInt(bedrooms))
    }

    // Sort properties
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "views":
          return b.views - a.views
        default:
          return 0
      }
    })

    setFilteredProperties(filtered)
  }, [properties, searchQuery, selectedType, priceRange, bedrooms, sortBy])

  const handleClearFilters = () => {
    setSearchQuery("")
    setSelectedType("")
    setPriceRange([0, 5000000])
    setBedrooms("")
    setSortBy("price-asc")
  }

  const FilterSection = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="search">Search</Label>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Location, property name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div>
        <Label>Property Type</Label>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            <SelectItem value="hdb">HDB</SelectItem>
            <SelectItem value="condo">Condo</SelectItem>
            <SelectItem value="landed">Landed</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Price Range</Label>
        <div className="mt-2 space-y-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={5000000}
            min={0}
            step={50000}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>S${priceRange[0].toLocaleString()}</span>
            <span>S${priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div>
        <Label>Bedrooms</Label>
        <Select value={bedrooms} onValueChange={setBedrooms}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any</SelectItem>
            <SelectItem value="1">1 Bedroom</SelectItem>
            <SelectItem value="2">2 Bedrooms</SelectItem>
            <SelectItem value="3">3 Bedrooms</SelectItem>
            <SelectItem value="4">4 Bedrooms</SelectItem>
            <SelectItem value="5">5+ Bedrooms</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button 
        variant="outline" 
        onClick={handleClearFilters}
        className="w-full"
      >
        <X className="mr-2 h-4 w-4" />
        Clear Filters
      </Button>
    </div>
  )

  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Properties for Sale</h1>
        <p className="text-muted-foreground">
          Browse through our extensive collection of properties in Singapore
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Filters Sidebar */}
        <div className="hidden lg:block lg:w-80">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FilterSection />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Mobile Filters and Sort */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterSection />
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex-1 sm:max-w-xs">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="views">Most Viewed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                {loading ? "Loading..." : `${filteredProperties.length} properties found`}
              </p>
              {(searchQuery || selectedType || bedrooms || priceRange[0] > 0 || priceRange[1] < 5000000) && (
                <div className="flex flex-wrap gap-2">
                  {searchQuery && (
                    <Badge variant="secondary">
                      Search: {searchQuery}
                    </Badge>
                  )}
                  {selectedType && (
                    <Badge variant="secondary">
                      Type: {selectedType}
                    </Badge>
                  )}
                  {bedrooms && (
                    <Badge variant="secondary">
                      {bedrooms} Bedroom{parseInt(bedrooms) > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Properties Grid */}
          <PropertyGrid 
            properties={filteredProperties}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}
