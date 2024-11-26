const express = require('express');
const app = express();
const connectDB = require('./config/database');
const PORT = 3000;
const cookieParser = require('cookie-parser')

app.use(express.json());
app.use(cookieParser());

// importing all the routes
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const connectionRequestRouter = require('./routes/request');
const userRouter = require('./routes/user');

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", connectionRequestRouter)
app.use("/", userRouter)

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

