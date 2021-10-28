const async = require("async");
const Brand = require("../models/brand");
const Product = require("../models/product");
const { body, validationResult } = require("express-validator");

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
      res.render("brand", {
        title: results.brand.title,
        product_list: results.brand_products,
      });
    }
  );
};

// Display brand create form on GET
exports.brand_create_get = function (req, res, next) {
  res.render("brand_form", { title: "Create Brand" });
};

// Handle brand create on POST
exports.brand_create_post = [
  // Validate and sanitize the name field
  body("title")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Brand name must be within 1-100 characters")
    .escape(),
  // Validate and sanitize the description field.
  body("description")
    .trim()
    .optional({ checkFalsy: true })
    .isAlphanumeric()
    .withMessage("Description can only contain alphanumeric characters.")
    .escape(),

  // Process request after validation and sanitization
  (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Create a brand object with escaped and trimmed data
    const brand = new Brand({
      title: req.body.title,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("brand_form", {
        title: "Create Brand",
        brand: brand,
        errors: errors.array(),
      });
    } else {
      // Data from the form is valid
      // Check if brand with same name already exists in database.
      Brand.findOne({ title: req.body.title }).exec(function (
        err,
        found_brand
      ) {
        if (err) {
          return next(err);
        }
        if (found_brand) {
          // Brand already exists, redirect to brand page
          res.redirect(found_brand.url);
        } else {
          brand.save(function (err) {
            if (err) {
              return next(err);
            }
            // New brand saved, redirect to brand detail page
            res.redirect(brand.url);
          });
        }
      });
    }
  },
];

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
