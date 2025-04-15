const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');
const ico = require('node-ico');

async function convertSvgToIco() {
  try {
    // Load the SVG file
    const svgPath = path.join(__dirname, 'public', 'icons', 'train-icon.svg');
    const img = await loadImage(svgPath);
    
    // Create canvases for different favicon sizes
    const sizes = [16, 32, 48];
    const pngBuffers = [];
    
    for (const size of sizes) {
      const canvas = createCanvas(size, size);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, size, size);
      pngBuffers.push({
        size,
        data: canvas.toBuffer('image/png')
      });
    }
    
    // Create ICO file
    const icoBuffer = ico.encode(pngBuffers);
    
    // Save to favicon.ico in public directory
    const faviconPath = path.join(__dirname, 'public', 'favicon.ico');
    fs.writeFileSync(faviconPath, icoBuffer);
    
    // Also save a copy to app directory for Next.js App Router
    const appFaviconPath = path.join(__dirname, 'app', 'favicon.ico');
    fs.writeFileSync(appFaviconPath, icoBuffer);
    
    console.log('Favicon created successfully!');
  } catch (error) {
    console.error('Error creating favicon:', error);
  }
}

convertSvgToIco();
