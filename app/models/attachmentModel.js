const mongoose = require('mongoose');

const AttachmentSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  attachmentType: {
    type: String,
    required: false,
  },
  resourceId: {
    type: String,
    required: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: async function(value) {
        const item = await mongoose.model('User').findById(value);
        return item !== null;
      },
      message: 'Invalid user ID',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Attachment = mongoose.model('Attachment', AttachmentSchema);

module.exports = Attachment;