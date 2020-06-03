const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const fs = require('fs');
/* const { promisify } = require('util');

const removeFile = promisify(fs.unlink); */

const multer = require('multer');
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, callback) {
    callback(null, new Date().toLocaleDateString() + '_' + file.originalname);
  },
});

const fileFilter = (req, file, callback) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    callback(null, true);
  } else {
    req.fileValidationError = 'Your file must be jpeg or png';
    callback('Your file must be jpeg or png', false);
  }
};
const uploadFiles = multer({
  storage: storage,
  limit: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

const Upload = require('../../models/Upload');

// Photo Upload
router.post('/', auth, uploadFiles.single('userImage'), async (req, res) => {
  fileFilter(req, res, function (err) {
    if (!req.fileValidationError) {
      res.send(req.fileValidationError);
    }
  });

  console.log(req.file);
  try {
    let userID = req.user.id;
    let upload = await Upload.findOne({ userID });

    const updates = {};

    if (upload) {
      // First Delelte Existed File Before Update
      const DIR = 'uploads';
      console.log(upload.userImage);
      await fs.unlinkSync(DIR + '/' + upload.userImage);

      // Update
      let userImage = req.file.filename;
      updates.userImage = userImage;
      upload = await Upload.findOneAndUpdate(
        { userID },
        { $set: updates },
        { new: true }
      );

      return res.json(upload);
    }

    upload = new Upload({
      userID: req.user.id,
      userImage: req.file.filename,
    });

    await upload.save();

    res.json(upload);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error.');
  }
});

// Get User Photo
router.get('/get', auth, async (req, res) => {
  try {
    let userID = req.user.id;
    let user = await Upload.findOne({ userID });
    let uploadPhoto = user.userImage;

    if (!uploadPhoto) {
      return res
        .status(400)
        .json({ msg: 'There is no photo for current user' });
    }

    res.json(uploadPhoto);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error.');
  }
});

// Delete All DB
router.delete('/delete', async (req, res, next) => {
  try {
    await Upload.deleteMany();
    res.json({ msg: 'All Uploads Deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
