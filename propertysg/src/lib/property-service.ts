import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  DocumentData,
  FieldValue 
} from 'firebase/firestore';
import { db } from './firebase';
import { Property } from '@/types';

export interface PropertyFormData {
  title: string;
  description: string;
  price: string;
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  address: string;
  district: string;
  postalCode: string;
  ownerName: string;
  contactNumber: string;
  whatsappNumber?: string;
  email: string;
  amenities?: string[];
  furnishing: string;
  availability: string;
  tenure: string;
}

class PropertyService {
  private collectionName = 'properties';

  // Convert images to base64 and store in Firestore (for free tier)
  async uploadImages(files: File[], propertyId: string): Promise<string[]> {
    if (files.length === 0) return [];

    const base64Images: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        console.log(`Converting image ${i + 1}/${files.length} to base64...`);
        
        // Convert file to base64
        const base64String = await this.fileToBase64(file);
        base64Images.push(base64String);
        
        console.log(`Successfully converted image ${i + 1}`);
      } catch (error) {
        console.error(`Error converting image ${i + 1}:`, error);
      }
    }

    return base64Images;
  }

  // Helper function to convert file to base64
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  // Delete images (for base64, we just remove them from Firestore)
  async deleteImages(imageUrls: string[]): Promise<void> {
    // Since we're using base64 stored in Firestore, 
    // images are deleted when the property document is updated
    console.log('Images will be removed when property is updated');
  }

  // Create a new property listing
  async createProperty(
    formData: PropertyFormData, 
    images: File[], 
    userId: string
  ): Promise<string> {
    try {
      // Create property data object
      const propertyData: Omit<Property, 'id'> = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        propertyType: formData.propertyType as Property['propertyType'],
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        area: parseInt(formData.area),
        location: {
          address: formData.address,
          district: formData.district,
          postalCode: formData.postalCode,
        },
        owner: {
          name: formData.ownerName,
          contactNumber: formData.contactNumber,
          whatsappNumber: formData.whatsappNumber,
          email: formData.email,
          userId: userId,
        },
        // Backward compatibility fields
        ownerName: formData.ownerName,
        ownerPhone: formData.contactNumber,
        amenities: formData.amenities || [],
        furnishing: formData.furnishing as Property['furnishing'],
        tenure: formData.tenure as Property['tenure'],
        availability: formData.availability,
        images: [], // Will be updated after image upload
        featured: false,
        status: 'available',
        views: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Add property to Firestore
      console.log("Adding property to Firestore...");
      const docRef = await addDoc(collection(db, this.collectionName), propertyData);
      const propertyId = docRef.id;
      console.log("Property added to Firestore with ID:", propertyId);

      // Upload images if any (this is optional, property can exist without images)
      let imageUploadSuccess = false;
      if (images.length > 0) {
        try {
          console.log(`Starting upload of ${images.length} images...`);
          const imageUrls = await this.uploadImages(images, propertyId);
          
          if (imageUrls.length > 0) {
            // Update property with image URLs
            await updateDoc(doc(db, this.collectionName, propertyId), {
              images: imageUrls,
              updatedAt: serverTimestamp(),
            });
            console.log(`Successfully uploaded ${imageUrls.length} images`);
            imageUploadSuccess = true;
          } else {
            console.warn("No images were successfully uploaded");
          }
        } catch (imageError) {
          console.error("Error uploading images (property still created):", imageError);
          // Don't throw - property was created successfully, just images failed
        }
      }

      console.log(`Property creation completed. ID: ${propertyId}, Images uploaded: ${imageUploadSuccess}`);
      return propertyId;
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  }

  // Update existing property
  async updateProperty(
    propertyId: string,
    formData: PropertyFormData, 
    newImages: File[],
    userId: string
  ): Promise<void> {
    try {
      // Prepare updated property data
      const updateData: Partial<Property> = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        propertyType: formData.propertyType as Property['propertyType'],
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        area: parseInt(formData.area),
        location: {
          address: formData.address,
          district: formData.district,
          postalCode: formData.postalCode,
        },
        owner: {
          name: formData.ownerName,
          contactNumber: formData.contactNumber,
          whatsappNumber: formData.whatsappNumber,
          email: formData.email,
          userId: userId,
        },
        // Backward compatibility fields
        ownerName: formData.ownerName,
        ownerPhone: formData.contactNumber,
        amenities: formData.amenities || [],
        furnishing: formData.furnishing as Property['furnishing'],
        tenure: formData.tenure as Property['tenure'],
        availability: formData.availability,
        updatedAt: serverTimestamp(),
      };

      // Handle new images if any
      if (newImages.length > 0) {
        try {
          console.log(`Uploading ${newImages.length} new images...`);
          const newImageUrls = await this.uploadImages(newImages, propertyId);
          
          // Get existing property to append to existing images
          const existingProperty = await this.getPropertyById(propertyId);
          const existingImages = existingProperty?.images || [];
          
          updateData.images = [...existingImages, ...newImageUrls];
        } catch (imageError) {
          console.error("Error uploading new images (property still updated):", imageError);
        }
      }

      // Update property in Firestore
      await updateDoc(doc(db, this.collectionName, propertyId), updateData);
      console.log("Property updated successfully:", propertyId);
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  }

  // Get all properties (public view)
  async getAllProperties(): Promise<Property[]> {
    try {
      console.log("🔥 PropertyService: Starting getAllProperties...")
      // Use simple query without orderBy to avoid composite index requirement
      const q = query(
        collection(db, this.collectionName),
        where('status', '==', 'available')
      );
      
      console.log("🔥 PropertyService: Executing Firestore query...")
      const querySnapshot = await getDocs(q);
      console.log("🔥 PropertyService: Query completed. Docs found:", querySnapshot.size)
      const properties: Property[] = [];
      
      querySnapshot.forEach((doc) => {
        console.log("🔥 PropertyService: Processing doc:", doc.id, doc.data())
        const data = doc.data();
        properties.push({
          id: doc.id,
          ...data,
          // Convert Firestore Timestamp to Date if needed
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
        } as Property);
      });
      
      console.log("🔥 PropertyService: Final properties array:", properties)
      // Sort in memory instead of in query
      return properties.sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt : new Date();
        const dateB = b.createdAt instanceof Date ? b.createdAt : new Date();
        return dateB.getTime() - dateA.getTime();
      });
    } catch (error) {
      console.error('❌ PropertyService Error fetching properties:', error);
      throw error;
    }
  }

  // Get featured properties
  async getFeaturedProperties(limitCount: number = 6): Promise<Property[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('status', '==', 'available'),
        where('featured', '==', true),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const properties: Property[] = [];
      
      querySnapshot.forEach((doc) => {
        properties.push({
          id: doc.id,
          ...doc.data(),
        } as Property);
      });
      
      return properties;
    } catch (error) {
      console.error('Error fetching featured properties:', error);
      throw error;
    }
  }

  // Get properties by user (for dashboard)
  async getUserProperties(userId: string): Promise<Property[]> {
    try {
      // Use simple query without orderBy to avoid composite index requirement
      const q = query(
        collection(db, this.collectionName),
        where('owner.userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const properties: Property[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        properties.push({
          id: doc.id,
          ...data,
          // Convert Firestore Timestamp to Date if needed
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
        } as Property);
      });
      
      // Sort in memory instead of in query
      return properties.sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt : new Date();
        const dateB = b.createdAt instanceof Date ? b.createdAt : new Date();
        return dateB.getTime() - dateA.getTime();
      });
    } catch (error) {
      console.error('Error fetching user properties:', error);
      throw error;
    }
  }

  // Get single property by ID
  async getPropertyById(propertyId: string): Promise<Property | null> {
    try {
      const docRef = doc(db, this.collectionName, propertyId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        // Increment view count
        await updateDoc(docRef, {
          views: (docSnap.data().views || 0) + 1,
        });
        
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as Property;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      throw error;
    }
  }

  // Delete property by ID
  async deleteProperty(propertyId: string, userId: string): Promise<void> {
    try {
      // First verify that the property belongs to the user
      const property = await this.getPropertyById(propertyId);
      
      if (!property) {
        throw new Error('Property not found');
      }
      
      if (property.owner.userId !== userId) {
        throw new Error('Unauthorized: You can only delete your own properties');
      }

      // Since we're using base64 images stored in Firestore,
      // we just need to delete the property document
      await deleteDoc(doc(db, this.collectionName, propertyId));
      
      console.log('Property deleted successfully:', propertyId);
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  }

  // Search properties
  async searchProperties(searchTerm: string): Promise<Property[]> {
    try {
      // Note: Firestore doesn't support full-text search natively
      // For production, consider using Algolia or similar service
      const q = query(
        collection(db, this.collectionName),
        where('status', '==', 'available'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const properties: Property[] = [];
      
      querySnapshot.forEach((doc) => {
        const property = { id: doc.id, ...doc.data() } as Property;
        
        // Simple text search (case-insensitive)
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          property.title.toLowerCase().includes(searchLower) ||
          property.description.toLowerCase().includes(searchLower) ||
          property.location.address.toLowerCase().includes(searchLower) ||
          property.location.district.toLowerCase().includes(searchLower);
        
        if (matchesSearch) {
          properties.push(property);
        }
      });
      
      return properties;
    } catch (error) {
      console.error('Error searching properties:', error);
      throw error;
    }
  }

  // Filter properties
  async filterProperties(filters: {
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    district?: string;
  }): Promise<Property[]> {
    try {
      let q = query(
        collection(db, this.collectionName),
        where('status', '==', 'available')
      );

      // Add filters
      if (filters.propertyType) {
        q = query(q, where('propertyType', '==', filters.propertyType));
      }
      if (filters.bedrooms) {
        q = query(q, where('bedrooms', '==', filters.bedrooms));
      }
      if (filters.district) {
        q = query(q, where('location.district', '==', filters.district));
      }

      q = query(q, orderBy('createdAt', 'desc'));
      
      const querySnapshot = await getDocs(q);
      const properties: Property[] = [];
      
      querySnapshot.forEach((doc) => {
        const property = { id: doc.id, ...doc.data() } as Property;
        
        // Apply price filters (done client-side due to Firestore limitations)
        if (filters.minPrice && property.price < filters.minPrice) return;
        if (filters.maxPrice && property.price > filters.maxPrice) return;
        
        properties.push(property);
      });
      
      return properties;
    } catch (error) {
      console.error('Error filtering properties:', error);
      throw error;
    }
  }
}

export const propertyService = new PropertyService();
export default propertyService;
export type { Property };