import multer from "multer";
import path from "path";

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

// File filter to accept only images
const fileFilter = (req: any, file: any, cb: any) => {
  if (!file.mimetype.startsWith("image")) {
    cb(new Error("Only image files are allowed!"), false);
  } else {
    cb(null, true);
  }
};

// Multer setup for handling multiple images (up to 5)
const upload = multer({
  storage: storage,
  limits: {
    files: 5, // Allow up to 5 files
    fileSize: 5 * 1024 * 1024, // 5MB max file size per image
  },
  fileFilter: fileFilter,
});

export default upload;
