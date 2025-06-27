const express = require('express');
const router = express.Router();
const WishlistItem = require('../models/WishlistItem'); // Create this model
const authMiddleware = require('../middleware/auth'); // Middleware to protect routes (assumed you have it)

// Get wishlist for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    console.log('GET /api/wishlist for user:', req.user.id);
    const wishlist = await WishlistItem.find({ user: req.user.id }).populate('book');
    res.json(wishlist.map(item => item.book)); // Send array of books
  } catch (error) {
    console.error('Error fetching wishlist:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// Add a book to wishlist
router.post('/', authMiddleware, async (req, res) => {
  const { bookId } = req.body;

  console.log('POST /api/wishlist called');
  console.log('User ID:', req.user.id);
  console.log('Book ID:', bookId);

  try {
    if (!bookId) {
      console.log('No bookId provided');
      return res.status(400).json({ message: 'No bookId provided' });
    }

    // Check if already in wishlist
    const exists = await WishlistItem.findOne({ user: req.user.id, book: bookId });
    if (exists) {
      console.log('Book already in wishlist:', bookId);
      return res.status(400).json({ message: 'Book already in wishlist' });
    }

    const newItem = new WishlistItem({ user: req.user.id, book: bookId });
    await newItem.save();
    console.log('Wishlist item saved:', newItem);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error adding to wishlist:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// Remove a book from wishlist
router.delete('/:bookId', authMiddleware, async (req, res) => {
  try {
    await WishlistItem.findOneAndDelete({ user: req.user.id, book: req.params.bookId });
    console.log(`Book ${req.params.bookId} removed from wishlist for user ${req.user.id}`);
    res.json({ message: 'Book removed from wishlist' });
  } catch (error) {
    console.error('Error removing from wishlist:', error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
