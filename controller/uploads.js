/* eslint-disable no-undef */
const fs  = require("fs");
const path = require("path");

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
const uploadFile = (file) => {
  const filePath = path.join(__dirname, "uploads", file.originalname);
  fs.writeFileSync(filePath, file.buffer);
};

exports.singleUpload = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    uploadFile(req.files[0]);

    res.json({ message: "File uploaded successfully" });
  } catch (err) {
    res.status(500).json({ message: "File upload failed", error: err.message });
  }
};

exports.bulkUpload = async(req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    req.files.forEach(uploadFile)
    res.json({ message: "File's uploaded successfully" });
   } catch (error) {
     res.status(500).json({ message: "File upload failed", error: error.message });
   }
};
 


