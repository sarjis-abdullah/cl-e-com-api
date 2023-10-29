const mongoose = require('mongoose');
const { ATTACHMENT_TYPES } = require('../enums');

const AttachmentSchema = new mongoose.Schema({
  mimeType: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    enum: ATTACHMENT_TYPES,
    default: "general",
  },
  fileName: {
    type: String,
    required: true,
  },
  resourceId: {
    type: String,
    required: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
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
});

const Attachment = mongoose.model('Attachment', AttachmentSchema);

module.exports = Attachment;