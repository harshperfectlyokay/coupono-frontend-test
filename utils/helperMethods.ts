import fs from "fs";
import path from "path";
import sharp from "sharp";


export const saveImageToLocal = async (base64Image: string, categoryName: string): Promise<string> => {
    const matches = base64Image.match(/^data:(.+);base64,(.+)$/);
    if (!matches) {
      throw new Error('Invalid base64 image data');
    }

    const ext = matches[1].split('/')[1];
    const buffer = Buffer.from(matches[2], 'base64');
  
    const imagesFolder = path.join(process.cwd(), 'images', 'categories');
    
    if (!fs.existsSync(imagesFolder)) {
      fs.mkdirSync(imagesFolder, { recursive: true });
    }
  
    const imagePath = path.join(imagesFolder, `${categoryName}.webp`);
  
    await sharp(buffer)
        .toFile(imagePath);
  
    return imagePath;
  };


  export const saveStoreImageToLocal = async (base64Image: string, categoryName: string): Promise<string> => {
    const matches = base64Image.match(/^data:(.+);base64,(.+)$/);
    if (!matches) {
      throw new Error('Invalid base64 image data');
    }

    const ext = matches[1].split('/')[1];
    const buffer = Buffer.from(matches[2], 'base64');
  
    const imagesFolder = path.join(process.cwd(), 'images', 'stores');
    
    if (!fs.existsSync(imagesFolder)) {
      fs.mkdirSync(imagesFolder, { recursive: true });
    }
  
    const imagePath = path.join(imagesFolder, `${categoryName}.webp`);
  
    await sharp(buffer)
        .toFile(imagePath);
  
    return imagePath;
  };