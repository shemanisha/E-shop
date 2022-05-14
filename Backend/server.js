const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const api = process.env.API_URL;

app.get(`${api}/products`, (req, res) => {
  console.log(req);
  res.send("hello");
});

app.listen(3000, () => {
  console.log("server is listening on port no 3000");
});
