const express = require("express");
const { default: mongoose } = require("mongoose");
const Category = require("../model/Category");
const router = express.Router();
const Product = require("../model/Product");

//getProducts
router.get("/getProducts", (req, res) => {
  //5f15d5b2cb4a6642bddc0fe7
  //5f15d545f3a046427a1c26e2
  //get product based on categories
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
    console.log(filter);
  }
  Product.find({ filter })
    .select()
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
    .populate("category")
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
  if (!mongoose.isValidObjectId(req.params.productid)) {
    return res.status(400).send("Invalid product id");
  }
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
        message: "Product deleted successfully",
        success: true,
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
  Category.findById(req.body.category)
    .then((category1) => {
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
    })
    .catch((err) => {
      err: err.message;
      success: false;
    });
});

router.get("/get/count", (req, res) => {
  Product.countDocuments()
    .then((count) => {
      return res.status(200).json({
        productcount: count,
        success: true,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        message: err.message,
        success: false,
      });
    });
});

router.get("/get/featured/:limit", (req, res) => {
  const limit = req.params.limit ? req.params.limit : 0;
  Product.find({ isFeatured: true })
    .limit(+limit)
    .then((products) => {
      return res.status(200).json({
        products: products,
        success: true,
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
