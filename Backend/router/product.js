const express = require("express");
const Category = require("../model/Category");
const router = express.Router();
const Product = require("../model/Product");

//getProducts
router.get("/getProducts", (req, res) => {
  Product.find()
    .then((products) => {
      return res.status(200).json({
        products: products,
        message: "Products fetched successfully",
        success: true,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        err: err.message,
        success: false,
      });
    });
});

//getProductById
router.get("/:productid", (req, res) => {
  Product.findById(req.params.productid)
    .then((product) => {
      return res.status(200).json({
        products: product,
        message: "Product fetched successfully",
        success: true,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        err: err.message,
        success: false,
      });
    });
});

//addProduct if valid category exist
router.post("/addProduct", (req, res) => {
  Category.findById(req.body.category).then((category1) => {
    if (!category1) {
      console.log(category1);
      return res.status(400).json({
        message: "Invalid Category",
      });
    }
    const {
      name,
      description,
      richDescription,
      image,
      brand,
      price,
      category,
      countInStock,
      rating,
      numReviews,
      isFeatured,
    } = req.body;

    const product = new Product({
      name,
      description,
      richDescription,
      image,
      brand,
      price,
      category,
      countInStock,
      rating,
      numReviews,
      isFeatured,
    });

    product
      .save()
      .then((createdProduct) => {
        return res.status(201).json({
          product: createdProduct,
          message: "Product created successfully",
          success: true,
        });
      })
      .catch((err) => {
        return res.status(500).json({ err: err.message, success: false });
      });
  });
});

//deleteProduct
router.delete("/:productid", (req, res) => {
  Product.findByIdAndRemove(req.params.productid)
    .then((deletedProduct) => {
      if (!deletedProduct) {
        return res.status(404).json({
          message: "Product doesn't exist",
          success: false,
        });
      }
      return res.status(200).json({
        product: deletedProduct,
        success: false,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        message: err.message,
        success: false,
      });
    });
});

//updateProduct

router.put("/:productid", (req, res) => {
  const {
    name,
    description,
    richDescription,
    image,
    brand,
    price,
    category,
    countInStock,
    rating,
    numReviews,
    isFeatured,
  } = req.body;

  Product.findByIdAndUpdate(
    req.params.productid,
    {
      name: name,
      description: description,
      richDescription: richDescription,
      image: image,
      brand: brand,
      price: price,
      category: category,
      countInStock: countInStock,
      rating: rating,
      numReviews: numReviews,
      isFeatured: isFeatured,
    },
    { new: true }
  )
    .then((updatedProduct) => {
      if (!updatedProduct) {
        return res.status(404).json({
          message: "Product doesn't exist",
          success: false,
        });
      }
      return res.status(200).json({
        product: updatedProduct,
        success: false,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        message: err.message,
        success: false,
      });
    });
});

module.exports = router;
