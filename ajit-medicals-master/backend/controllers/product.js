const Product = require("../models/Product");
const Category = require("../models/Category");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Product not found",
        });
      }
      req.product = product;
      next();
    });
};

exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  // console.log("IN CREATE PROD");

  form.parse(req, (err, fields, file) => {
    console.log(err);
    if (err) {
      return res.status(400).json({
        error: "problem with image",
      });
    }
    //destructure the fields
    const { name, company, price, category } = fields;
    // console.log(fields);
    if (!name || !company || !price || !category) {
      return res.status(400).json({
        error: "Please include all fields",
      });
    }

    let product = new Product(fields);

    //handle file here
    if (file.photo) {
      if (file.photo.size > 1000000) {
        return res.status(400).json({
          error: "File size too big!",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    console.log(product);

    //save to the DB
    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "Saving product in DB failed",
        });
      }
      res.json(product);
    });
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

//middleware
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

// delete controllers
exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete the product",
      });
    }
    res.json({
      message: "Deletion was a success",
      deletedProduct,
    });
  });
};

// delete controllers
exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image",
      });
    }

    //updation code
    let product = req.product;
    product = _.extend(product, fields);

    //handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    // console.log(product);

    //save to the DB
    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "Updation of product failed",
        });
      }
      res.json(product);
    });
  });
};

//product listing

exports.getAllProducts = (req, res) => {
  let currentPage = req.query.currentPage ? parseInt(req.query.currentPage) : 1;
  let pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  let sortBy = req.query.sortBy ? req.query.sortBy : "name";

  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .skip((currentPage - 1) * pageSize)
    .limit(pageSize)
    .exec((err, products) => {
      console.log("BACKEND", products);
      if (err) {
        return res.status(400).json({
          error: "NO product FOUND",
        });
      }
      res.json(products);
    });
};

exports.getProductsByCategory = (req, res) => {
  const category = req.category;
  let currentPage = req.query.currentPage ? parseInt(req.query.currentPage) : 1;
  let pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  let sortBy = req.query.sortBy ? req.query.sortBy : "name";

  Product.find({ category: category._id })
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .skip((currentPage - 1) * pageSize)
    .limit(pageSize)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "Not able to fetch products",
        });
      }
      res.json(products);
    });
};

exports.getSearchQueryResults = (req, res) => {
  let { q, currentPage, pageSize } = req.query;
  currentPage = parseInt(currentPage);
  pageSize = parseInt(pageSize);
  let sortBy = req.query.sortBy ? req.query.sortBy : "name";

  let qryregex = new RegExp(q);
  Product.countDocuments(
    { name: { $regex: qryregex, $options: "i" } },
    (err, productCount) => {
      Product.find({ name: { $regex: qryregex, $options: "i" } })
        .sort([[sortBy, "asc"]])
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
        .exec((err, products) => {
          if (err) console.log(err);
          else {
            res.json({ products, productCount });
          }
        });
    }
  );
};

exports.getAllPageCount = (req, res) => {
  let pageCountMap = {};
  Category.find({}).exec(async (err, categories) => {
    if (err) {
      console.log(err);
    } else {
      await Promise.all(
        categories.map(async (cat, idx) => {
          let categoryCount = await Product.countDocuments({
            category: cat._id,
          });
          pageCountMap[cat._id] = categoryCount;
        })
      );
      pageCountMap["all"] = Object.values(pageCountMap).reduce((a, b) => a + b);
      res.json(pageCountMap);
    }
  });
};
