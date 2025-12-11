const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const execAsync = promisify(exec);

const assetsDir = path.join(__dirname, '../public/assets');
const compressedDir = path.join(__dirname, '../public/assets/compressed');

// Create compressed directory if it doesn't exist
if (!fs.existsSync(compressedDir)) {
  fs.mkdirSync(compressedDir, { recursive: true });
}

// List of videos to compress
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

async function compressVideo(inputPath, outputPath) {
  const fileName = path.basename(inputPath);
  
  // Check if file exists
  if (!fs.existsSync(inputPath)) {
    console.log(`⚠ File not found: ${fileName}`);
    return;
  }

  // Check if already compressed
  if (fs.existsSync(outputPath)) {
    console.log(`⊘ Already compressed: ${fileName}`);
    return;
  }

  try {
    console.log(`⚙ Compressing ${fileName}...`);
    
    // FFmpeg command for high-quality compression
    // - CRF 28: Good balance between quality and size (lower = better quality, 18-28 recommended)
    // - Preset medium: Balance between encoding speed and compression
    // - Scale to max 1920 width (maintains aspect ratio)
    // - Audio: AAC codec, 128k bitrate
    const ffmpegCommand = `ffmpeg -i "${inputPath}" \
      -vf "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease" \
      -c:v libx264 -crf 28 -preset medium \
      -c:a aac -b:a 128k \
      -movflags +faststart \
      -y "${outputPath}"`;
    
    await execAsync(ffmpegCommand);
    
    // Get file sizes
    const originalSize = fs.statSync(inputPath).size;
    const compressedSize = fs.statSync(outputPath).size;
    const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(1);
    
    console.log(`✓ Compressed ${fileName}: ${formatBytes(originalSize)} → ${formatBytes(compressedSize)} (${reduction}% reduction)`);
  } catch (error) {
    console.error(`✗ Failed to compress ${fileName}:`, error.message);
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

async function checkFFmpeg() {
  try {
    await execAsync('ffmpeg -version');
    return true;
  } catch (error) {
    console.error('❌ FFmpeg not found. Please install it first:');
    console.error('   macOS: brew install ffmpeg');
    console.error('   Ubuntu: sudo apt-get install ffmpeg');
    console.error('   Windows: Download from https://ffmpeg.org/download.html');
    return false;
  }
}

async function compressAll() {
  console.log('Checking for FFmpeg...\n');
  
  if (!await checkFFmpeg()) {
    return;
  }
  
  console.log('Starting video compression...\n');
  
  for (const video of videos) {
    const inputPath = path.join(assetsDir, video);
    const outputPath = path.join(compressedDir, video);
    await compressVideo(inputPath, outputPath);
  }
  
  console.log('\n✓ Compression complete!');
  console.log(`Compressed videos are in: ${compressedDir}`);
}

compressAll().catch(console.error);
