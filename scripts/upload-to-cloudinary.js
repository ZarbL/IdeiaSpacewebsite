require('dotenv').config({ path: '.env.local' });
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const assetsDir = path.join(__dirname, '../public/assets');
const compressedDir = path.join(__dirname, '../public/assets/compressed');

// List of videos to upload
const videos = [
  'emblema.mp4',
  'space.mp4',
  'terranoite.mp4',
  'desafioespacial.mp4',
  'galaxyespiral.mp4',
  'nossalideranca.mp4',
  'planetaagua.mp4',
  'ideiaforword.mp4',
  'metodology.mp4',
  'Terraespaco.mp4',
  'historia1.mp4',
  'historia2.mp4',
  'historia3.mp4'
];

// List of images to upload
const images = [
  'falcon9.jpg',
  'kiteducational.png',
  'MissionProgrammingTool.png',
  'card1.png',
  'card2.png',
  'card3.png',
  'card4.jpg',
  'card5.jpg',
  'impactocard1.png',
  'impactocard3.png',
  'beneficio1.png',
  'beneficio2.png',
  'beneficio3.png',
  'nebulus.png',
  'student3.png',
  'LiderMatheus.png',
  'LiderLeonardo.png',
  'LiderRafael.png',
  'LiderVictorBatista.png',
  'MarianafromIdeiaSite.png',
  'RosenofromIdeiaSite.png',
  'partner1.png',
  'partner2.png',
  'partner3.png',
  'partner4.png',
  'partner5.png',
  'partner6.png',
  'partner7.png',
  'partner8.png',
  'transporter15.png',
  'vetorizada.png',
  'Recursos.png'
];

async function uploadFile(filePath, publicId, resourceType) {
  try {
    const uploadOptions = {
      public_id: publicId,
      resource_type: resourceType,
      folder: 'ideiaspace',
      overwrite: true,
      quality: 'auto',
      fetch_format: 'auto'
    };

    // For large files, use eager async transformation
    if (resourceType === 'video') {
      uploadOptions.eager_async = true;
      uploadOptions.eager = [
        { quality: 'auto', format: 'mp4' }
      ];
    }

    const result = await cloudinary.uploader.upload(filePath, uploadOptions);
    console.log(`✓ Uploaded ${publicId}`);
    return result;
  } catch (error) {
    console.error(`✗ Failed to upload ${publicId}:`, error.message);
    return null;
  }
}

async function uploadAll() {
  console.log('Starting upload to Cloudinary...\n');
  
  // Upload videos
  console.log('Uploading videos...');
  for (const video of videos) {
    // Try compressed version first, fallback to original
    let filePath = path.join(compressedDir, video);
    if (!fs.existsSync(filePath)) {
      filePath = path.join(assetsDir, video);
    }
    
    if (fs.existsSync(filePath)) {
      const publicId = video.replace('.mp4', '');
      const stats = fs.statSync(filePath);
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      console.log(`  Uploading ${video} (${sizeMB} MB)...`);
      await uploadFile(filePath, publicId, 'video');
    } else {
      console.log(`⚠ File not found: ${video}`);
    }
  }
  
  console.log('\nUploading images...');
  // Upload images
  for (const image of images) {
    const filePath = path.join(assetsDir, image);
    if (fs.existsSync(filePath)) {
      const publicId = image.replace(/\.(png|jpg|jpeg)$/, '');
      await uploadFile(filePath, publicId, 'image');
    } else {
      console.log(`⚠ File not found: ${image}`);
    }
  }
  
  console.log('\n✓ Upload complete!');
}

uploadAll().catch(console.error);
