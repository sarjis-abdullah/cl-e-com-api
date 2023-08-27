const mongoose = require('mongoose');

const AttachmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  // Other Attachment-related fields can be added here
});

const Attachment = mongoose.model('Attachment', AttachmentSchema);

module.exports = Attachment;