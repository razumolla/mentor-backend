// Import the Express module
const express = require('express');

// this is the instance of express js application
const app = express();


// Define a port
const PORT = 3000;

app.use("/test", (req, res) => {
  res.send('Hello World!')
})


app.use("/hello", (req, res) => {
  res.send('Hello !')
})

app.use("/razu", (req, res) => {
  res.send('Hello razu!')
})

// Start the server and listen on the defined port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
