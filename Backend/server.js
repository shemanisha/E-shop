const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");
const productRoute = require("./router/product");
const app = express();
dotenv.config();

const api = process.env.API_URL;
const portno = process.env.PORT || 3000;

//Middleware
app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use("/product", productRoute);

//database connection
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("database connection successful");
  })
  .catch((err) => {
    console.log("error connecting to database", err.message);
  });

app.listen(portno, () => {
  console.log("server is listening on port no 3000");
});
