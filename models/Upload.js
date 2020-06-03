const mongoose = require('mongoose');
const User = require('./User');

const UploadSchema = new mongoose.Schema({
  userID: {
    type: String,
    ref: 'User',
  },
  userImage: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Upload = mongoose.model('upload', UploadSchema);
