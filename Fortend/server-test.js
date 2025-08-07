const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const newsletterRoutes = require('./routes/newsletter');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/newsletter', newsletterRoutes);

mongoose.connect('mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));