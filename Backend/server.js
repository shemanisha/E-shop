const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");
const authJwt = require("./helpers/jwtMiddleware");
const productRoute = require("./router/product");
const categoryRoute = require("./router/categories");
const userRoute = require("./router/user");
const orderRoute = require("./router/order");
const errorHandler = require("./helpers/errorHandler");
const path = require("path");
const app = express();
dotenv.config();

const api = process.env.API_URL;
const portno = process.env.PORT || 3000;

//Middleware
app.use(cors());
app.options("*", cors());

app.use(express.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
app.use(errorHandler);
console.log(path.join(__dirname + "/public/uploads"));
//Routes
app.use("/product", productRoute);
app.use("/categories", categoryRoute);
app.use("/user", userRoute);
app.use("/order", orderRoute);

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
