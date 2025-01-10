require("dotenv").config();
const express = require("express");
const mongoose = require("./mongoose");

const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const clubRoutes = require("./routes/clubRoutes");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/user", userRoutes);
app.use("/club", clubRoutes);

app.get("/", (req, res) => {
  res.send("Library Management API is running");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
