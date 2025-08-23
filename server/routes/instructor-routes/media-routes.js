// const express = require("express");
// const multer = require("multer");
// const {
//   uploadMediaToCloudinary,
//   deleteMediaFromCloudinary,
// } = require("../../helpers/cloudinary");

// const router = express.Router();

// const upload = multer({ dest: "uploads/" });

// router.post("/upload", upload.single("file"), async (req, res) => {
//   try {
//     const result = await uploadMediaToCloudinary(req.file.path);
//     res.status(200).json({
//       success: true,
//       data: result,
//     });
//   } catch (e) {
//     console.log(e);

//     res.status(500).json({ success: false, message: "Error uploading file" });
//   }
// });

// router.delete("/delete/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!id) {
//       return res.status(400).json({
//         success: false,
//         message: "Assest Id is required",
//       });
//     }

//     await deleteMediaFromCloudinary(id);

//     res.status(200).json({
//       success: true,
//       message: "Assest deleted successfully from cloudinary",
//     });
//   } catch (e) {
//     console.log(e);

//     res.status(500).json({ success: false, message: "Error deleting file" });
//   }
// });

// router.post("/bulk-upload", upload.array("files", 10), async (req, res) => {
//   try {
//     const uploadPromises = req.files.map((fileItem) =>
//       uploadMediaToCloudinary(fileItem.path)
//     );

//     const results = await Promise.all(uploadPromises);

//     res.status(200).json({
//       success: true,
//       data: results,
//     });
//   } catch (event) {
//     console.log(event);

//     res
//       .status(500)
//       .json({ success: false, message: "Error in bulk uploading files" });
//   }
// });

// module.exports = router;

const express = require("express");
const multer = require("multer");
const {
  uploadMediaToCloudinary,
  deleteMediaFromCloudinary,
} = require("../../helpers/cloudinary");

const router = express.Router();

// use memory storage instead of writing to "uploads/"
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Single file upload
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const result = await uploadMediaToCloudinary(req.file.buffer);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error uploading file" });
  }
});

// Delete file from Cloudinary
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Asset Id is required",
      });
    }

    await deleteMediaFromCloudinary(id);

    res.status(200).json({
      success: true,
      message: "Asset deleted successfully from Cloudinary",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error deleting file" });
  }
});

// Bulk upload (multiple files)
router.post("/bulk-upload", upload.array("files", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    const uploadPromises = req.files.map((fileItem) =>
      uploadMediaToCloudinary(fileItem.buffer)
    );

    const results = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (event) {
    console.log(event);
    res.status(500).json({ success: false, message: "Error in bulk uploading files" });
  }
});

module.exports = router;
