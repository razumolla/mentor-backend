const express = require('express');
const connectDB = require('./config/database');
const app = express();
const PORT = 3000;

const User = require('./models/user');

app.post('/signup', async (req, res) => {

  //creating a new instance of user model
  const user = new User({
    firstName: "Hadiz",
    lastName: "Rahman",
    emailId: "hafiz@gmail.com",
    password: "123456",
    age: 25,
    gender: "Male",
  });
  try {
    await user.save();
    res.send("User Created Successfully");
  } catch (err) {
    res.status(400).send("User Creation Failed", err.message);
  }
});

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

