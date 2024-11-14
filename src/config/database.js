
const mongoose = require('mongoose');

const connectDB = async function main() {
  await mongoose.connect('mongodb+srv://razumolla:iivvGZsnP4lZgTwd@cluster0.dxnal.mongodb.net/devTinder');

}

module.exports = connectDB;



//razumolla
// iivvGZsnP4lZgTwd
// mongodb+srv://razumolla:<db_password>@cluster0.dxnal.mongodb.net/

