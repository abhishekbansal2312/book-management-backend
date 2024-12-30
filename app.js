require("dotenv").config();
const express = require("express");
const mongoose = require("./mongoose");

const bodyParser = require("body-parser");
const bookRoutes = require("./routes/bookRoutes");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/books", bookRoutes);

app.get("/", (req, res) => {
  res.send("Library Management API is running");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
