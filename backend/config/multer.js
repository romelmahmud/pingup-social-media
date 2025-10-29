import multer from "multer";

// Use memory storage so files are kept in memory as Buffer
// This is perfect for direct upload to ImageKit
const storage = multer.memoryStorage();

// File filter: allow only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Max file size: 5MB (adjust if needed)
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;
