const async = require("async");
const Brand = require("../models/brand");
const Product = require("../models/product");

// Display list of all brands
exports.brand_list = function (req, res, next) {
  Brand.find().exec((err, brand_list) => {
    if (err) {
      return next(err);
    }
    res.render("brand_list", {
      title: "Brands",
      brand_list,
    });
  });
};

// Display detail page for a specific brand
exports.brand_detail = function (req, res, next) {
  async.parallel(
    {
      brand: function (callback) {
        Brand.findById(req.params.id).exec(callback);
      },
      brand_products: function (callback) {
        Product.find({ brand: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      res.json(results);
    }
  );
};

// Display brand create form on GET
exports.brand_create_get = function (req, res, next) {
  res.send("NOT IMPLEMENTED: Brand create form GET");
};

// Handle brand create on POST
exports.brand_create_post = function (req, res, next) {
  res.send("NOT IMPLEMENTED: Brand create form POST");
};

// Display brand delete form on GET
exports.brand_delete_get = function (req, res, next) {
  res.send("NOT IMPLEMENTED: Brand delete form GET");
};

// Handle brand delete form on POST
exports.brand_delete_post = function (req, res, next) {
  res.send("NOT IMPLEMENTED: Brand delete form POST");
};

// Display brand update form on GET
exports.brand_update_get = function (req, res, next) {
  res.send("NOT IMPLEMENTED: Brand update form GET");
};

// Handle brand update form on POST
exports.brand_update_post = function (req, res, next) {
  res.send("NOT IMPLEMENTED: Brand update form POST");
};
