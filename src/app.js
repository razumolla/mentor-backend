const express = require('express');
const connectDB = require('./config/database');
const app = express();
const PORT = 3000;
const User = require('./models/user');
const { validateSignupData, validateLoginData } = require('./utils/validation');
const bcrypt = require('bcrypt');
var cookieParser = require('cookie-parser')
var jwt = require('jsonwebtoken');
const { userAuth } = require('./middlewares/auth');

app.use(express.json());
app.use(cookieParser());

app.post('/signup', async (req, res) => {
  try {
    // validate the data
    validateSignupData(req);

    // Encrypt the password
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash) // $2b$10$k7s7yjJRs8F4SMJRr6Gx7ui1spAOjaGAp1Z.wqBNd2iYq5NtDyN5m

    // Then store the data into database

    //creating a new instance of user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash
    });

    await user.save();
    res.send({ Message: "User Created Successfully", user: user });
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;

    console.log("sending the connection request to user");

    res.send(user.firstName + " " + "Sent the Connection Request ");
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

// login user
app.post('/login', async (req, res) => {
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
          httpOnly: true
        }
      );
      res.send("Login successfully");
    } else {
      throw new Error("Invalid Credintials");
    }
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

app.get("/feed", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

// get user by emailId 
app.get('/user', async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const user = await User.findOne({ emailId: userEmail });
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (error) {
    result.status(400).send("something went wrong");
  }
});

app.get("/userbyid", async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findById({ _id: userId });
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (error) {
    result.status(400).send("something went wrong");
  }
});


app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send({ message: "User deleted successfully" });
    }
  } catch (error) {
    result.status(400).send("something went wrong");
  }
});

// update user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    // Define allowed update fields
    const ALLOWED_UPDATES = ["age", "gender", "photoUrl", "about", "skills"];

    // Ensure all provided fields in `data` are in the ALLOWED_UPDATES list
    const isUpdateAllowed = Object.keys(data).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed. Invalid fields provided.");
    }

    // Check if the `skills` field is present and its length does not exceed 10
    if (data.skills && data.skills.length > 10) {
      throw new Error("Skills can only have a maximum of 10 entries.");
    }

    // Find and update the user
    const user = await User.findByIdAndUpdate(userId, data, {
      new: true,  // Use `new` instead of `returnDocument: "after"` to return the updated document
      runValidators: true
    });

    // Check if the user was found
    if (!user) {
      throw new Error("User not found.");
    }

    res.send({ message: "User updated successfully", user });

  } catch (err) {
    // Send more detailed error information for debugging
    console.error(err); // Log error for debugging purposes
    res.status(500).send({ error: "Something went wrong: " + err.message });
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

