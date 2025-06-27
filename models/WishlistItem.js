const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  addedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WishlistItem', wishlistItemSchema);
