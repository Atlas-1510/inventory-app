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
  body("title")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Product title length must be within 1-100 characters.")
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
  body("quantity")
    .trim()
    .isInt({ min: 0 })
    .withMessage("Quantity required.")
    .escape(),
  body("brand.*").escape(),
  body("category.*").escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    console.log(req.body.brand);
    const product = new Product({
      title: req.body.title,
      price: req.body.price,
      rating: req.body.rating,
      quantity: req.body.quantity,
      brand: req.body.brand,
      category: req.body.category,
    });
    console.log(product.brand);
    if (!errors.isEmpty()) {
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

          results.brands.forEach((brand) => {
            if (brand.id === req.body.brand) {
              brand.checked = true;
            } else {
              brand.checked = false;
            }
          });
          results.categories.forEach((category) => {
            if (category.id === req.body.category) {
              category.checked = true;
            } else {
              category.checked = false;
            }
          });
          res.render("product_form_create", {
            title: "Create Product",
            brands: results.brands,
            categories: results.categories,
            product: product,
            errors: errors.array(),
          });
        }
      );
    } else {
      product.save(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect(product.url);
      });
    }
  },
];

// Display product delete form on GET
exports.product_delete_get = function (req, res, next) {
  Product.findById(req.params.id).exec(function (err, result) {
    if (err) {
      return next(err);
    }
    console.log(result);
    res.render("product_form_delete", result);
  });
};

// Handle product delete form on POST
exports.product_delete_post = function (req, res, next) {
  Product.findByIdAndDelete(req.body.product_id).exec(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/products");
  });
};

// Display product update form on GET
exports.product_update_get = function (req, res, next) {
  res.send("NOT IMPLEMENTED: Product update form GET");
};

// Handle product update form on POST
exports.product_update_post = function (req, res, next) {
  res.send("NOT IMPLEMENTED: Product update form POST");
};
