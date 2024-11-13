// Import the Express module
const express = require('express');

// this is the instance of express js application
const app = express();


// Define a port
const PORT = 3000;




app.get("/user", (req, res) => {
  res.send({ firname: "Razu", lastname: "Molla" });
})
app.use("/user", (req, res) => {
  res.send({ firname: "Razu" });
})

app.post("/user", (req, res) => {
  res.send('post users !')
})


app.use("/test", (req, res) => {
  res.send('Hello nothing!')
})


// Start the server and listen on the defined port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
