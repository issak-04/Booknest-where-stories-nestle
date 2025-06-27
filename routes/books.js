const express = require('express');
const router = express.Router();
const Book = require('../models/Book'); // We’ll create this model next

// GET all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
