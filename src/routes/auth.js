const express = require('express');
const authRouter = express.Router();

const bcrypt = require('bcrypt');
const User = require('../models/user');
const { validateSignupData, validateLoginData } = require('../utils/validation');
const { userAuth } = require('../middlewares/auth');

// get all users 
authRouter.get("/users", userAuth, async (req, res) => {
  try {
    const users = await User.find({});

    res.send(users);
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

//get Current User
authRouter.get("/me", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

// POST /signup
authRouter.post('/signup', async (req, res) => {
  try {
    // validate the data
    validateSignupData(req);

    // Encrypt the password
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10); // $2b$10$k7s7yjJRs8F4SMJRr6Gx7ui1spAOjaGAp1Z.wqBNd2iYq5NtDyN5m

    // Then store the data into database

    //creating a new instance of user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash
    });

    const savedUser = await user.save();

    var token = await user.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000)
    });

    res.send({ Message: "User Created Successfully", data: savedUser });
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

// POST /login
authRouter.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;
    validateLoginData(req);

    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid Credintials");
    }

    const isPasswordMatched = await user.validatePassword(password);

    if (isPasswordMatched) {
      var token = await user.getJWT(); // we offloded to the user model

      //  add the token to cookies and send the response back to the user
      res.cookie("token",
        token,
        {
          expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
          // httpOnly: true
        }
      );
      res.send(user);
    } else {
      throw new Error("Invalid Credintials");
    }
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

// @desc      Logout user 
// @route     DELETE /api/v1/auth/logout
// @access    Private
authRouter.post('/logout', async (req, res) => {
  // res.clearCookie('token');
  res.cookie('token', null, {
    expires: new Date(Date.now())
  });

  res.send('Logged out successfully');
});

module.exports = authRouter;