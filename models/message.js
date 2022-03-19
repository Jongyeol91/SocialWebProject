const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  messageAuthor: String,
  messageTarget: String,
  messageTargetId: String,
  messageAuthorId: String,
  content: String,
  createdDate: { type: Date, default: Date.now },
});

module.exports = new mongoose.model('Message', messageSchema);
