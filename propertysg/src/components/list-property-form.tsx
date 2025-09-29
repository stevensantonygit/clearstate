"use client"

import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Upload, X, Phone, Mail, MapPin, DollarSign, Home, Camera } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { propertyService, PropertyFormData, Property } from "@/lib/property-service"

const propertyFormSchema = z.object({
  title: z.string().min(10, "Property title must be at least 10 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  price: z.string().min(1, "Price is required"),
  propertyType: z.string().min(1, "Property type is required"),
  listingType: z.string().min(1, "Listing type is required"),
  bedrooms: z.string().min(1, "Number of bedrooms is required"),
  bathrooms: z.string().min(1, "Number of bathrooms is required"),
  area: z.string().min(1, "Area is required"),
  address: z.string().min(10, "Full address is required"),
  district: z.string().min(1, "District is required"),
  postalCode: z.string().min(6, "Valid postal code is required"),
  ownerName: z.string().min(2, "Owner name is required"),
  contactNumber: z.string().min(8, "Valid contact number is required"),
  whatsappNumber: z.string().optional(),
  email: z.string().email("Valid email is required"),
  amenities: z.array(z.string()).optional(),
  furnishing: z.string().min(1, "Furnishing status is required"),
  availability: z.string().min(1, "Availability date is required"),
  tenure: z.string().min(1, "Tenure type is required"),
})

const amenitiesList = [
  "Swimming Pool", "Gym", "Parking", "Security", "Playground", "BBQ Area",
  "Tennis Court", "Function Room", "24hr Concierge", "CCTV", "Near MRT",
  "Near Shopping Mall", "Near Schools", "Air Conditioning", "Balcony"
]

export function ListPropertyForm({ onSuccess, editProperty }: { onSuccess?: () => void, editProperty?: Property | null }) {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(editProperty?.amenities || [])
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()

  const isEditMode = !!editProperty

  const form = useForm<z.infer<typeof propertyFormSchema>>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: editProperty?.title || "",
      description: editProperty?.description || "",
      price: editProperty?.price?.toString() || "",
      propertyType: editProperty?.propertyType || "",
      listingType: editProperty?.listingType || "sale",
      bedrooms: editProperty?.bedrooms?.toString() || "",
      bathrooms: editProperty?.bathrooms?.toString() || "",
      area: editProperty?.area?.toString() || "",
      address: editProperty?.location?.address || "",
      district: editProperty?.location?.district || "",
      postalCode: editProperty?.location?.postalCode || "",
      ownerName: editProperty?.owner?.name || "",
      contactNumber: editProperty?.owner?.contactNumber || "",
      whatsappNumber: editProperty?.owner?.whatsappNumber || "",
      email: editProperty?.owner?.email || "",
      amenities: editProperty?.amenities || [],
      furnishing: editProperty?.furnishing || "",
      availability: editProperty?.availability || "",
      tenure: editProperty?.tenure || "",
    },
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length > 0) {
      setUploadedImages(prev => [...prev, ...files].slice(0, 10)) // Max 10 images
      toast.success(`${files.length} image(s) uploaded successfully`)
    }
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev => {
      const updated = prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
      form.setValue("amenities", updated)
      return updated
    })
  }

  async function onSubmit(values: z.infer<typeof propertyFormSchema>) {
    if (!user) {
      toast.error("You must be logged in to list a property")
      return
    }

    setIsSubmitting(true)
    try {
      // Prepare form data
      const formData: PropertyFormData = {
        ...values,
        amenities: selectedAmenities,
      }

      if (isEditMode && editProperty?.id) {
        // Update existing property
        console.log("Starting property update...")
        await propertyService.updateProperty(editProperty.id, formData, uploadedImages, user.uid)
        console.log("Property updated successfully")
        toast.success("Property updated successfully!")
      } else {
        // Create new property
        console.log("Starting property creation...")
        const propertyId = await propertyService.createProperty(
          formData,
          uploadedImages,
          user.uid
        )
        console.log("Property created successfully with ID:", propertyId)
        toast.success("Property listed successfully!")
      }
      
      // Reset form
      form.reset()
      setSelectedAmenities([])
      setUploadedImages([])
      
      // Call success callback
      if (onSuccess) {
        onSuccess()
      }
    } catch (error: unknown) {
      console.error("Error listing property:", error)
      
      // Show more specific error message
      let errorMessage = "Failed to list property. Please try again."
      
      if (error instanceof Error) {
        if (error.message.includes("index")) {
          errorMessage = "Database configuration issue. Property saved but display may be delayed."
        } else if (error.message.includes("CORS")) {
          errorMessage = "Image upload issue. Property saved but images may not display correctly."
        } else {
          errorMessage = error.message
        }
      }
      
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-6 w-6" />
            List Your Property
          </CardTitle>
          <CardDescription>
            Fill in the details below to list your property on PropertySG
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Basic Property Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Property Details</h3>
                
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Spacious 3-bedroom condo in Orchard" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your property in detail..."
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <FormField
                    control={form.control}
                    name="propertyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="hdb">HDB Flat</SelectItem>
                            <SelectItem value="condo">Condominium</SelectItem>
                            <SelectItem value="landed">Landed Property</SelectItem>
                            <SelectItem value="commercial">Commercial</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="listingType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Listing Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sale or Rent" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="sale">For Sale</SelectItem>
                            <SelectItem value="rent">For Rent</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bedrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bedrooms *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5+</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bathrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bathrooms *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4+</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="area"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Area (sqft) *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 1200" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Price (SGD) *
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 1200000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Location Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location
                </h3>
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Address *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 123 Orchard Road, Singapore" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>District *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select district" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="district-1">District 1 (Boat Quay, CBD)</SelectItem>
                            <SelectItem value="district-9">District 9 (Orchard, River Valley)</SelectItem>
                            <SelectItem value="district-10">District 10 (Bukit Timah, Holland)</SelectItem>
                            <SelectItem value="district-11">District 11 (Novena, Thomson)</SelectItem>
                            <SelectItem value="district-15">District 15 (Katong, Marine Parade)</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 238873" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Property Features */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Property Features</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="furnishing"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Furnishing *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select furnishing" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="fully-furnished">Fully Furnished</SelectItem>
                            <SelectItem value="partially-furnished">Partially Furnished</SelectItem>
                            <SelectItem value="unfurnished">Unfurnished</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tenure"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tenure *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select tenure" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="freehold">Freehold</SelectItem>
                            <SelectItem value="leasehold-99">99-year Leasehold</SelectItem>
                            <SelectItem value="leasehold-999">999-year Leasehold</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="availability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Available From *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Amenities */}
                <div>
                  <FormLabel>Amenities</FormLabel>
                  <FormDescription>Select all amenities available</FormDescription>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {amenitiesList.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox
                          id={amenity}
                          checked={selectedAmenities.includes(amenity)}
                          onCheckedChange={() => handleAmenityToggle(amenity)}
                        />
                        <label htmlFor={amenity} className="text-sm">
                          {amenity}
                        </label>
                      </div>
                    ))}
                  </div>
                  {selectedAmenities.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedAmenities.map((amenity) => (
                        <Badge key={amenity} variant="secondary" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contact Information</h3>
                
                <FormField
                  control={form.control}
                  name="ownerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owner/Agent Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., John Tan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="contactNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Contact Number *
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., +65 9123 4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="whatsappNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WhatsApp Number (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., +65 9123 4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Address *
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Property Images
                </h3>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      Click to upload property images (Max 10 images)
                    </p>
                  </label>
                </div>

                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {uploadedImages.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Property image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Listing Property..." : "List Property"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}