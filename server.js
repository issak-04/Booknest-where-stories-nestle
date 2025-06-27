const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import auth routes
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const wishlistRoutes = require('./routes/wishlist');

app.use(cors());
app.use(express.json());

// Use auth routes on /api/auth path
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/wishlist', wishlistRoutes);


mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mernstack04')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Backend is working!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});