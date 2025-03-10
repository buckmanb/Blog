// server.js
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
// const cors = require('cors');
const nocache = require('nocache');

// Load environment variables from .env file if in development or production
if (process.env.NODE_ENV === 'development') {
  dotenv.config(); // This will load .env into process.env
}

const app = express();

app.use(nocache());
//middleware
// app.use(cors({
//   origin: process.env.CLIENT_URL || 'http://localhost:4200',
//   credentials: true
// }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, 'dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

// Start server - Only in development
if(process.env.NODE_ENV === 'development'){
    const PORT = process.env.PORT || 80;
    app.listen(PORT, () => {      
      console.log(`Server running on port ${PORT}`);
    });
}
module.exports = app;