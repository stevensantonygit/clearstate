import Image from "next/image"
import Link from "next/link"
import { Property } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MapPin, Bed, Bath, Square, Eye } from "lucide-react"

interface PropertyCardProps {
  property: Property
  onFavorite?: (propertyId: string) => void
  isFavorited?: boolean
}

export function PropertyCard({ property, onFavorite, isFavorited }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getPropertyTypeColor = (type: string) => {
    switch (type) {
      case 'hdb':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'condo':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'landed':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      case 'commercial':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative">
        <Link href={`/properties/${property.id || 'unknown'}`}>
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={(property.images && property.images.length > 0) ? property.images[0] : "/placeholder-property.jpg"}
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
              className={`absolute top-3 right-3 ${getPropertyTypeColor(property.propertyType)}`}
            >
              {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}
            </Badge>
          </div>
        </Link>
        
        {onFavorite && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-white/80 hover:bg-white dark:bg-black/80 dark:hover:bg-black"
            onClick={() => property.id && onFavorite(property.id)}
          >
            <Heart 
              className={`h-4 w-4 ${
                isFavorited 
                  ? "fill-red-500 text-red-500" 
                  : "text-gray-600 dark:text-gray-300"
              }`} 
            />
          </Button>
        )}
      </div>

      <CardContent className="p-4">
        <Link href={`/properties/${property.id || 'unknown'}`}>
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                {property.title}
              </h3>
              <div className="flex items-center text-muted-foreground text-sm mt-1">
                <MapPin className="h-3 w-3 mr-1" />
                <span className="line-clamp-1">{property.location.address}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Bed className="h-4 w-4 mr-1" />
                  <span>{property.bedrooms}</span>
                </div>
                <div className="flex items-center">
                  <Bath className="h-4 w-4 mr-1" />
                  <span>{property.bathrooms}</span>
                </div>
                <div className="flex items-center">
                  <Square className="h-4 w-4 mr-1" />
                  <span>{property.area} sqft</span>
                </div>
              </div>
              <div className="flex items-center">
                <Eye className="h-3 w-3 mr-1" />
                <span>{property.views}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-primary">
                {formatPrice(property.price)}
              </div>
              <Badge variant="outline" className="text-xs">
                {property.status}
              </Badge>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  )
}
