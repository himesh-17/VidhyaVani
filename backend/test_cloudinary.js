import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary explicitly to ensure it picks up env vars
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const testUpload = async () => {
    try {
        console.log('Attempting to connect to Cloudinary...');
        console.log(`Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);

        // Upload a sample image from a remote URL to create the folder
        const url = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=60';

        const result = await cloudinary.uploader.upload(url, {
            folder: 'VidyaVani', // This will create the folder
            public_id: 'connection_test_image'
        });

        console.log('✅ Success! Image uploaded.');
        console.log('📁 Folder "VidyaVani" should now exist.');
        console.log('🔗 Image URL:', result.secure_url);

    } catch (error) {
        console.error('❌ Upload Failed:', error);
    }
};

testUpload();
