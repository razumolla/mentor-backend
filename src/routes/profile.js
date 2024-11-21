const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const { validateProfileEditData } = require('../utils/validation');


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


module.exports = profileRouter;