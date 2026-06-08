const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, '../src/app/icon.svg');
const svgContent = fs.readFileSync(svgPath);

async function createIco() {
  const sizes = [16, 32, 48, 256];

  const images = await Promise.all(
    sizes.map(async (size) => {
      const buffer = await sharp(svgContent)
        .resize(size, size)
        .png()
        .toBuffer();
      return { size, buffer };
    })
  );

  const count = images.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  const totalHeaderSize = headerSize + dirEntrySize * count;

  let offset = totalHeaderSize;
  const entries = images.map(({ size, buffer }) => {
    const entry = { size, buffer, offset };
    offset += buffer.length;
    return entry;
  });

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const dirEntries = entries.map(({ size, buffer, offset }) => {
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(size === 256 ? 0 : size, 0);
    entry.writeUInt8(size === 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(buffer.length, 8);
    entry.writeUInt32LE(offset, 12);
    return entry;
  });

  const icoBuffer = Buffer.concat([header, ...dirEntries, ...entries.map(e => e.buffer)]);

  const outputPath = path.join(__dirname, '../src/app/favicon.ico');
  fs.writeFileSync(outputPath, icoBuffer);
  console.log(`favicon.ico gerado (${icoBuffer.length} bytes)`);
}

createIco().catch(console.error);
