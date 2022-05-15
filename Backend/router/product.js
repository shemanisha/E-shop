const express = require("express");
const router = express.Router();
const Product = require("../model/Product");

router.get("/getProducts", (req, res) => {
  Product.find()
    .then((products) => {
      res.status(200).json(products);
    })
    .catch((err) => {
      res.status(500).json({
        err: err.message,
      });
    });
});

router.post("/addProduct", (req, res) => {
  const { name, imageUrl, countInStock } = req.body;
  console.log(req.body);
  const product = new Product({
    name,
    imageUrl,
    countInStock,
  });

  product
    .save()
    .then((createdProduct) => {
      res.status(201).json(createdProduct);
    })
    .catch((err) => {
      res.status(500).json({ err: err.message });
    });
});

module.exports = router;
