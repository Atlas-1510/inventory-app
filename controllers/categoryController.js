const async = require("async");
const Category = require("../models/category");
const Product = require("../models/product");

// Display list of all categories
exports.category_list = function (req, res, next) {
  Category.find().exec((err, category_list) => {
    if (err) {
      return next(err);
    }
    res.render("category_list", {
      title: "Categories",
      category_list,
    });
  });
};

// Display detail page for a specific category
exports.category_detail = function (req, res, next) {
  async.parallel(
    {
      category: function (callback) {
        Category.findById(req.params.id).exec(callback);
      },
      category_products: function (callback) {
        Product.find({ category: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      res.render("category", {
        title: results.category.title,
        product_list: results.category_products,
      });
    }
  );
};

// Display category create form on GET
exports.category_create_get = function (req, res, next) {
  res.send("NOT IMPLEMENTED: Category create form GET");
};

// Handle category create on POST
exports.category_create_post = function (req, res, next) {
  res.send("NOT IMPLEMENTED: Category create form POST");
};

// Display category delete form on GET
exports.category_delete_get = function (req, res, next) {
  res.send("NOT IMPLEMENTED: Category delete form GET");
};

// Handle category delete form on POST
exports.category_delete_post = function (req, res, next) {
  res.send("NOT IMPLEMENTED: Category delete form POST");
};

// Display category update form on GET
exports.category_update_get = function (req, res, next) {
  res.send("NOT IMPLEMENTED: Category update form GET");
};

// Handle category update form on POST
exports.category_update_post = function (req, res, next) {
  res.send("NOT IMPLEMENTED: Category update form POST");
};
