const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const Category = require("../model/Category");
const router = express.Router();
const Product = require("../model/Product");

//mimetye declaration
const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

//multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: (req, file, cb) => {
    const filename = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${filename}-${Date.now()}.${extension}`);
  },
});
const upload = multer({ storage: storage });

//getProducts
router.get("/getProducts", (req, res) => {
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
router.post("/addProduct", upload.single("image"), (req, res) => {
  const file = req.file;
  console.log("file", file);
  if (!file) {
    return res.status(400).json({
      message: "No image in request",
    });
  }
  const image = req.file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  const imageUrl = `${basePath}${image}`;
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
      image: imageUrl,
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
router.put("/:productid", upload.single("image"), (req, res) => {
  if (!mongoose.isValidObjectId(req.params.productid)) {
    return res.status(400).send("Invalid product id");
  }
  let imagePath;
  const file = req.file;
  Product.findById(req.params.productid)
    .then((productexist) => {
      if (file) {
        const image = file.filename;
        const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
        imagePath = `${basePath}${image}`;
      } else {
        imagePath = productexist.image;
      }
    })
    .catch((err) => {
      return res.status(404).json({
        message: "Product doesnt exist!",
        success: false,
      });
    });

  Category.findById(req.body.category)
    .then((category1) => {
      if (!category1) {
        return res.status(400).json({
          message: "Invalid Category",
        });
      }
      const {
        name,
        description,
        richDescription,
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
          image: imagePath,
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
          console.log(updatedProduct);
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

//get total count of products
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

//To limit the featured product
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

// To update gallery images of a product
router.put(
  "/gallery-images/:productid",
  upload.array("images", 10),
  (req, res) => {
    const files = req.files;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    const imagesPath = [];
    if (files) {
      files.map((file) => {
        imagesPath.push(`${basePath} ${file.filename}`);
      });
    }

    Product.findByIdAndUpdate(
      req.params.productid,
      {
        images: imagesPath,
      },
      { new: true }
    )
      .then((product) => {
        return res.status(200).json({
          product: product,
          success: true,
        });
      })
      .catch((err) => {
        return res.status(500).json({
          message: err.message,
          success: false,
        });
      });
  }
);

module.exports = router;
