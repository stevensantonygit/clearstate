"use client"

import { useState, useEffect } from "react"
import { Property } from "@/types"
import { PropertyCard } from "@/components/property-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface PropertyGridProps {
  properties: Property[]
  loading?: boolean
  onLoadMore?: () => void
  hasMore?: boolean
  onFavorite?: (propertyId: string) => void
  favoriteProperties?: string[]
}

export function PropertyGrid({ 
  properties, 
  loading, 
  onLoadMore, 
  hasMore, 
  onFavorite,
  favoriteProperties = []
}: PropertyGridProps) {
  if (loading && properties.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <PropertyCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground text-lg mb-4">
          No properties found
        </div>
        <p className="text-sm text-muted-foreground">
          Try adjusting your search filters or check back later for new listings.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard
            key={property.id || `property-${Math.random()}`}
            property={property}
            onFavorite={onFavorite}
            isFavorited={property.id ? favoriteProperties.includes(property.id) : false}
          />
        ))}
      </div>

      {loading && properties.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <PropertyCardSkeleton key={`loading-${index}`} />
          ))}
        </div>
      )}

      {hasMore && !loading && onLoadMore && (
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={onLoadMore}
            className="px-8"
          >
            Load More Properties
          </Button>
        </div>
      )}
    </div>
  )
}

function PropertyCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-4 w-8" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    </div>
  )
}
