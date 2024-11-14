const express = require('express');
const connectDB = require('./config/database');
const app = express();
const PORT = 3000;

connectDB()
  .then(() => {
    console.log("Database Connected Successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database Connection Failed", err);
  });

