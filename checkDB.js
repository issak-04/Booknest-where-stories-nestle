const mongoose = require('mongoose');

// Your MongoDB URI (replace `yourDBName` with your actual database name)
const dbURI = 'mongodb://localhost:27017/yourDBName';

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('MongoDB connected');
    console.log('Database Name:', mongoose.connection.name); // Log the database name
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });