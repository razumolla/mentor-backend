
const mongoose = require('mongoose');

const connectDB = async function main() {
  await mongoose.connect('mongodb+srv://razumolla:iivvGZsnP4lZgTwd@cluster0.dxnal.mongodb.net/devTinder'
    // , { autoIndex: true, } // Ensures indexes are automatically created
  );
}

module.exports = connectDB;
