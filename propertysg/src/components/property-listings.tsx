"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { IconBed, IconMapPin, IconPlus, IconRuler, IconBath, IconArrowLeft, IconEye, IconHome, IconX, IconTrash } from "@tabler/icons-react"
import { ListPropertyForm } from "@/components/list-property-form"
import { useAuth } from "@/contexts/auth-context"
import { propertyService, Property } from "@/lib/property-service"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"

const amenitiesList = [
  "Swimming Pool", "Gym", "Parking", "Security", "Playground", "BBQ Area",
  "Tennis Court", "Function Room", "24hr Concierge", "CCTV", "Near MRT",
  "Near Shopping Mall", "Near Schools", "Air Conditioning", "Balcony"
]

export function PropertyListings() {
  const [showListForm, setShowListForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchUserProperties()
  }, [user])

  const fetchUserProperties = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      console.log("Fetching user properties for user:", user.uid)
      const userProperties = await propertyService.getUserProperties(user.uid)
      console.log("Fetched properties:", userProperties)
      setProperties(userProperties)
    } catch (error: unknown) {
      console.error("Error fetching properties:", error)
      
      // More specific error handling
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch properties'
      if (errorMessage.includes("index")) {
        toast.error("Loading properties... Database is being configured.")
        // Still try to show properties, they might exist
      } else {
        toast.error("Failed to load properties")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleFormSuccess = () => {
    setShowListForm(false)
    setShowEditForm(false)
    fetchUserProperties() // Refresh the list
  }

  const handleEditProperty = (property: Property) => {
    setSelectedProperty(property)
    setShowEditForm(true)
  }

  const handleViewProperty = (property: Property) => {
    setSelectedProperty(property)
    setShowViewModal(true)
  }

  const handleDeleteProperty = async (property: Property) => {
    if (!user) return
    
    const confirmed = window.confirm(
      `Are you sure you want to delete "${property.title}"? This action cannot be undone.`
    )
    
    if (!confirmed) return
    
    try {
      await propertyService.deleteProperty(property.id!, user.uid)
      toast.success("Property deleted successfully!")
      fetchUserProperties() // Refresh the list
    } catch (error: unknown) {
      console.error("Error deleting property:", error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete property'
      toast.error(errorMessage)
    }
  }

  const handleCloseModals = () => {
    setShowListForm(false)
    setShowEditForm(false)
    setShowViewModal(false)
    setSelectedProperty(null)
  }

  if (showListForm || showEditForm) {
    return (
      <div className="px-4 lg:px-6">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={handleCloseModals}
            className="flex items-center gap-2"
          >
            <IconArrowLeft className="h-4 w-4" />
            Back to Properties
          </Button>
        </div>
        <ListPropertyForm 
          onSuccess={handleFormSuccess} 
          editProperty={showEditForm ? selectedProperty : undefined}
        />
      </div>
    )
  }

  return (
    <div className="px-4 lg:px-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Your Properties</h2>
          <p className="text-muted-foreground">
            Manage and track your property listings
          </p>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setShowListForm(true)}
        >
          <IconPlus className="h-4 w-4" />
          List New Property
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-video bg-muted animate-pulse" />
              <CardContent className="p-4 space-y-2">
                <div className="h-4 bg-muted animate-pulse rounded" />
                <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
                <div className="h-6 bg-muted animate-pulse rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <IconHome className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No properties listed yet</h3>
          <p className="text-muted-foreground mb-4">
            Start by listing your first property to reach potential buyers.
          </p>
          <Button onClick={() => setShowListForm(true)}>
            <IconPlus className="h-4 w-4 mr-2" />
            List Your First Property
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative overflow-hidden bg-muted">
                {property.images && property.images.length > 0 ? (
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <IconHome className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <Badge 
                  className="absolute top-2 right-2 bg-background/80 text-foreground"
                  variant="secondary"
                >
                  {property.propertyType.toUpperCase()}
                </Badge>
                {property.views > 0 && (
                  <Badge 
                    className="absolute top-2 left-2 bg-background/80 text-foreground flex items-center gap-1"
                    variant="secondary"
                  >
                    <IconEye className="h-3 w-3" />
                    {property.views}
                  </Badge>
                )}
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg leading-tight line-clamp-2">
                      {property.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 text-sm">
                      <IconMapPin className="h-3 w-3" />
                      {property.location.address}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {property.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="text-2xl font-bold text-primary">
                  ${property.price.toLocaleString()}
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <IconBed className="h-4 w-4" />
                    <span>{property.bedrooms} bed</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <IconBath className="h-4 w-4" />
                    <span>{property.bathrooms} bath</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <IconRuler className="h-4 w-4" />
                    <span>{property.area} sqft</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="pt-0 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleEditProperty(property)}
                >
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleDeleteProperty(property)}
                >
                  <IconTrash className="h-4 w-4 mr-1" />
                  Delete
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleViewProperty(property)}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* View Property Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {selectedProperty?.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedProperty && (
            <div className="space-y-6">
              {/* Property Images */}
              {selectedProperty.images && selectedProperty.images.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedProperty.images.map((image, index) => (
                    <div key={index} className="aspect-video rounded-lg overflow-hidden bg-muted">
                      <img
                        src={image}
                        alt={`${selectedProperty.title} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
              
              {/* Property Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Property Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price:</span>
                        <span className="font-semibold text-primary">${selectedProperty.price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span>{selectedProperty.propertyType.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bedrooms:</span>
                        <span>{selectedProperty.bedrooms}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bathrooms:</span>
                        <span>{selectedProperty.bathrooms}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Area:</span>
                        <span>{selectedProperty.area} sqft</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Furnishing:</span>
                        <span>{selectedProperty.furnishing}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tenure:</span>
                        <span>{selectedProperty.tenure}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Location</h3>
                    <div className="space-y-1">
                      <p>{selectedProperty.location.address}</p>
                      <p className="text-muted-foreground">{selectedProperty.location.district}</p>
                      <p className="text-muted-foreground">Postal Code: {selectedProperty.location.postalCode}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Owner:</span>
                        <span>{selectedProperty.owner.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phone:</span>
                        <span>{selectedProperty.owner.contactNumber}</span>
                      </div>
                      {selectedProperty.owner.whatsappNumber && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">WhatsApp:</span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              const cleanNumber = selectedProperty.owner.whatsappNumber?.replace(/\D/g, "")
                              window.open(`https://wa.me/${cleanNumber}`, "_blank")
                            }}
                          >
                            Chat on WhatsApp
                          </Button>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span>{selectedProperty.owner.email}</span>
                      </div>
                    </div>
                  </div>
                  
                  {selectedProperty.amenities && selectedProperty.amenities.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Amenities</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProperty.amenities.map((amenity, index) => (
                          <Badge key={index} variant="secondary">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {selectedProperty.description && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedProperty.description}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}