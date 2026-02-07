import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

// Configure storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('只支持图片格式 (JPEG, PNG, GIF, WebP)'));
  }
};

// Initialize multer
export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter,
});

// Image processing and standardization
export const processImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return next();
    }

    const uploadsDir = path.join(process.cwd(), 'uploads');
    const imagesDir = path.join(uploadsDir, 'images');

    // Create directories if they don't exist
    await fs.mkdir(uploadsDir, { recursive: true });
    await fs.mkdir(imagesDir, { recursive: true });

    // Generate unique filename
    const filename = `${uuidv4()}.webp`;
    const filepath = path.join(imagesDir, filename);
    const relativePath = `/uploads/images/${filename}`;

    // Process and standardize image with sharp
    await sharp(req.file.buffer)
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 85 })
      .toFile(filepath);

    // Attach file info to request
    req.file.filename = filename;
    req.file.path = filepath;
    req.body.imageUrl = relativePath;

    next();
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({
      success: false,
      message: '图片处理失败',
    });
  }
};

// Process multiple images
export const processImages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return next();
    }

    const uploadsDir = path.join(process.cwd(), 'uploads');
    const imagesDir = path.join(uploadsDir, 'images');

    // Create directories if they don't exist
    await fs.mkdir(uploadsDir, { recursive: true });
    await fs.mkdir(imagesDir, { recursive: true });

    const processedFiles: string[] = [];

    for (const file of req.files) {
      // Generate unique filename
      const filename = `${uuidv4()}.webp`;
      const filepath = path.join(imagesDir, filename);
      const relativePath = `/uploads/images/${filename}`;

      // Process and standardize image with sharp
      await sharp(file.buffer)
        .resize(1200, 1200, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 85 })
        .toFile(filepath);

      processedFiles.push(relativePath);
    }

    req.body.imageUrls = processedFiles;
    next();
  } catch (error) {
    console.error('Error processing images:', error);
    res.status(500).json({
      success: false,
      message: '图片处理失败',
    });
  }
};
