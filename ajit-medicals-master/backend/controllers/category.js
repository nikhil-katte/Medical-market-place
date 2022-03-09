const Category = require("../models/Category");
const Product = require("../models/Product");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: "Category not found in DB",
      });
    }
    req.category = category;
    next();
  });
};

exports.createCategory = (req, res) => {
  let { name } = req.body;
  name = name.toLowerCase();
  const category = new Category({name});
  category.save((err, category) => {
    if (err || !category) {
      if (err.code === 11000)
        return res.status(400).json({
          error: "Duplicate category, not adding!",
        });
      return res.status(400).json({
        error: "Unable to save category in DB",
      });
    }
    res.json({ category });
  });
};

exports.getCategory = (req, res) => {
  res.json(req.category);
};

exports.getAllCategories = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err || !categories) {
      return res.status(400).json({
        error: "No Categories found",
      });
    }
    res.json(categories);
  });
};

exports.updateCategory = (req, res) => {
  const category = req.category;
  category.name = req.body.category;
  category.save((err, updatedCategory) => {
    if (err || !category) {
      return res.status(400).json({
        error: "Failed to update category",
      });
    }
    res.json(updatedCategory);
  });
};

exports.removeCategory = (req, res) => {
  const category = req.category;
  category.remove((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: "Failed to delete category",
      });
    }
    // remove associated products
    Product.deleteMany({'category': category._id}, (err, data) => {
      if (err) {
        console.log(err);
        res.json({
          msg: "Deleted category successfully. Unable to delete Products!"
        })
      }
      res.json({
        msg: "Successfully deleted category",
      });
    })
  });
};

