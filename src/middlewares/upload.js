import multer from "multer";
import path from "path";
import { promises as fs } from "fs";

// Upload klasoru olustur
const uploadDir = "uploads";
try {
  await fs.mkdir(uploadDir, { recursive: true });
} catch (error) {
  console.log("Upload directory already exists or error creating:", error.message);
}

// Multer storage konfigurasyonu
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // uploads klasorune kaydet
  },
  filename: function (req, file, cb) {
    // Benzersiz dosya adi olustur: timestamp + random + original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

// Dosya filtresi - sadece resim dosyalarini kabul et
const fileFilter = (req, file, cb) => {
  // Kabul edilen MIME tipleri
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, GIF, WEBP) are allowed!'), false);
  }
};

// Multer konfigurasyonu
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB maksimum dosya boyutu
  }
});

// Tek dosya upload middleware'i
export const uploadSingle = upload.single('photo');

// Hata handling middleware'i
export const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 400,
        message: 'File too large. Maximum size is 5MB.',
        data: {}
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        status: 400,
        message: 'Unexpected field. Use "photo" field for file upload.',
        data: {}
      });
    }
  }
  
  if (error.message.includes('Only image files')) {
    return res.status(400).json({
      status: 400,
      message: error.message,
      data: {}
    });
  }

  next(error);
};
