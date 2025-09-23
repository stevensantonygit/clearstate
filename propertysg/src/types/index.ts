export interface Property {
  id?: string;
  title: string;
  description: string;
  price: number;
  propertyType: 'hdb' | 'condo' | 'landed' | 'commercial';
  bedrooms: number;
  bathrooms: number;
  area: number;
  location: {
    address: string;
    district: string;
    postalCode: string;
  };
  owner: {
    name: string;
    contactNumber: string;
    whatsappNumber?: string;
    email: string;
    userId: string;
  };
  // Backward compatibility properties
  ownerName?: string;
  ownerPhone?: string;
  amenities: string[];
  furnishing: 'fully-furnished' | 'partially-furnished' | 'unfurnished';
  tenure: 'freehold' | 'leasehold-99' | 'leasehold-999' | 'other';
  availability: string;
  images: string[];
  featured: boolean;
  status: 'available' | 'sold' | 'rented' | 'pending';
  views: number;
  createdAt: any;
  updatedAt: any;
}

export interface User {
  id: string;
  email: string;
  name: string;
  username?: string;
  phone?: string;
  avatar?: string;
  role: 'user' | 'agent' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  favoriteProperties: string[];
}

export interface SearchFilters {
  propertyType?: string[];
  location?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  bedrooms?: number;
  bathrooms?: number;
  areaRange?: {
    min: number;
    max: number;
  };
  amenities?: string[];
}
