const Product = require("../models/product");
const Brand = require("../models/brand");
const Category = require("../models/category");
const async = require("async");
const { body, validationResult } = require("express-validator");

// Display list of all products
exports.product_list = (req, res, next) => {
  Product.find().exec((err, product_list) => {
    if (err) {
      return next(err);
    }
    res.render("product_list", {
      product_list,
      title: "Products",
    });
  });
};

// Display detail page for a specific product
exports.product_detail = (req, res, next) => {
  Product.findById(req.params.id)
    .populate("brand")
    .populate("category")
    .exec((err, result) => {
      if (err) {
        return next(err);
      }
      res.render("product", result);
    });
};

// Display product create form on GET
exports.product_create_get = function (req, res, next) {
  async.parallel(
    {
      brands: function (callback) {
        Brand.find(callback);
      },
      categories: function (callback) {
        Category.find(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      res.render("product_form_create", {
        title: "Create Product",
        brands: results.brands,
        categories: results.categories,
      });
    }
  );
};

// Handle product create on POST
exports.product_create_post = [
  (req, res, next) => {
    if (!(req.body.brand instanceof Array)) {
      if (typeof req.body.brand === "undefined") {
        req.body.brand = [];
      } else {
        req.body.brand = new Array(req.body.brand);
      }
    }
    next();
  },
  (req, res, next) => {
    if (!(req.body.category instanceof Array)) {
      if (typeof req.category.brand === "undefined") {
        req.body.category = [];
      } else {
        req.body.category = new Array(req.body.category);
      }
    }
    next();
  },
  function (req, res, next) {
    body("title")
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Product title length must be within 1-100 characters")
      .escape(),
      body("price")
        .trim()
        .isCurrency({ allow_negatives: false, digits_after_decimal: [0, 1, 2] })
        .withMessage(
          "Price must be positive, and have two or fewer decimal places."
        )
        .escape(),
      body("rating")
        .trim()
        .isIn([1, 2, 3, 4, 5])
        .withMessage("Rating must be 1-5, inclusive.")
        .escape(),
      body("quantity").trim().isInt({ min: 0 }).not().isFloat().escape(),
      body("brand.*").escape(),
      body("category.*").escape(),
      (req, res, next) => {
        const errors = validationResult(req);
        const product = new Product({
          title: req.body.title,
          price: req.body.price,
          rating: req.body.rating,
          quantity: req.body.quantity,
          brand: req.body.brand,
          category: req.body.category,
        });

        if (!errors.isEmpty()) {
          async.parallel({
            brands: function (callback) {
              Brand.find(callback);
            },
            categories: function (callback) {
              Category.find(callback);
            },
            function(err, results) {
              if (err) {
                return next(err);
              }
              for (let i = 0; i < results.brands.length; i++) {
                if (product.brand.indexOf(results.brands[i] > -1)) {
                  results.brands[i].checked = "true";
                }
              }
              for (let i = 0; i < results.categories.length; i++) {
                if (product.category.indexOf(results.categories[i] > -1)) {
                  results.categories[i].checked = "true";
                }
              }
              res.render("product_form_create", {
                title: "Create Product",
                brands: results.brands,
                categories: results.categories,
                product: product,
                errors: errors.array(),
              });
            },
          });
          return;
        } else {
          product.save(function (err) {
            if (err) {
              return next(err);
            }
            res.redirect(product.url);
          });
        }
      };
  },
];

// Display product delete form on GET
exports.product_delete_get = function (req, res, next) {
  res.send("NOT IMPLEMENTED: Product delete form GET");
};

// Handle product delete form on POST
exports.product_delete_post = function (req, res, next) {
  res.send("NOT IMPLEMENTED: Product delete form POST");
};

// Display product update form on GET
exports.product_update_get = function (req, res, next) {
  res.send("NOT IMPLEMENTED: Product update form GET");
};

// Handle product update form on POST
exports.product_update_post = function (req, res, next) {
  res.send("NOT IMPLEMENTED: Product update form POST");
};
