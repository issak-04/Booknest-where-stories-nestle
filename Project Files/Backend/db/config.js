// ./db/config.js

const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://mernstack04:mernstack04@cluster0.of8ouai.mongodb.net/mernstackDB?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Atlas connected successfully'))
  .catch((err) => console.error('❌ MongoDB Atlas connection error:', err));
