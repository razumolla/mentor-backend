const express = require('express');
const connectDB = require('./config/database');
const app = express();
const PORT = 3000;
app.use(express.json());
const User = require('./models/user');



app.post('/signup', async (req, res) => {

  //creating a new instance of user model
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User Created Successfully");
  } catch (err) {
    res.status(400).send("User Creation Failed:" + err.message);
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

