// Alternative image service using free tier of Cloudinary
// You can get a free account at cloudinary.com

export class CloudinaryImageService {
  private cloudName = 'your-cloud-name'; // Replace with your Cloudinary cloud name
  private uploadPreset = 'your-upload-preset'; // Replace with your upload preset

  async uploadImages(files: File[]): Promise<string[]> {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', this.uploadPreset);

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        const data = await response.json();
        return data.secure_url;
      } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    return results.filter(url => url !== null) as string[];
  }
}

// Instructions to set up Cloudinary (Free tier):
// 1. Go to cloudinary.com and create a free account
// 2. Get your cloud name from the dashboard
// 3. Create an unsigned upload preset in Settings > Upload
// 4. Replace the values above with your actual cloud name and preset
// 5. Free tier allows 25GB storage and 25GB monthly bandwidth