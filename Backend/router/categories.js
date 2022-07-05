const express = require("express");
const Category = require("../model/Category");
const mongoose = require("mongoose");
const router = express.Router();

//getCategories
router.get("/getCategories", (req, res) => {
  Category.find()
    .then((categoryList) => {
      return res.status(200).json({
        categories: categoryList,
        message: "Categories fetched successfully",
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

//getById
router.get("/:categoryid", (req, res) => {
  Category.findById(req.params.categoryid)
    .then((category) => {
      if (!category) {
        return res
          .status(404)
          .json({ message: "Category doesn't exist", success: false });
      }
      return res.status(200).json({
        category: category,
        message: "Category fetched successfully",
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

//addCategory
router.post("/addCategory", (req, res) => {
  const { name, color, icon, image } = req.body;
  const category = new Category({
    name,
    color,
    icon,
    image,
  });
  category
    .save()
    .then((category) => {
      return res.status(201).json({
        category: category,
        message: "Category created successfully",
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

//deleteCategory
router.delete("/:categoryid", (req, res) => {
  if (!mongoose.isValidObjectId(req.params.categoryid)) {
    return res.status(400).send("Invalid category id");
  }
  Category.findByIdAndRemove(req.params.categoryid)
    .then((deletedcategory) => {
      if (!deletedcategory) {
        return res.status(404).json({
          message: "Category doesn't exist",
          success: false,
        });
      }
      return res.status(200).json({
        message: "Category deleted successfully",
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

//updateCategory
router.put("/:categoryid", (req, res) => {
  if (!mongoose.isValidObjectId(req.params.categoryid)) {
    return res.status(400).send("Invalid category id");
  }
  const { name, color, icon, image } = req.body;
  Category.findByIdAndUpdate(req.params.categoryid, {
    name: name,
    color: color,
    icon: icon,
    image: image,
  })
    .then((updatedcategory) => {
      if (!updatedcategory) {
        return res.status(404).json({
          message: "Category doesn't exist",
          success: false,
        });
      }
      return res.status(200).json({
        category: updatedcategory,
        message: "Category updated successfully",
        success: true,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message,
        success: false,
      });
    });
});

module.exports = router;
