const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const { validateProfileEditData } = require('../utils/validation');
const bcrypt = require('bcrypt');

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach(field => {
      loggedInUser[field] = req.body[field];
    })

    await loggedInUser.save();

    // res.send(`${loggedInUser.firstName} , Your profile has been updated successfully`);
    res.status(200).json({
      Message: `${loggedInUser.firstName} , Your profile has been updated successfully`,
      data: loggedInUser
    });
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

// Forgot Password API
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = req.user;
    // Generate a random password
    const NewPassword = await bcrypt.hash(password, 10);

    // Update the password
    user.password = NewPassword;
    await user.save();

    res.send("Password Reset Successfully");
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

module.exports = profileRouter;