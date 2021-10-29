const async = require("async");
const Category = require("../models/category");
const Product = require("../models/product");
const { body, validationResult } = require("express-validator");

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
        category: results.category,
        product_list: results.category_products,
      });
    }
  );
};

// Display category create form on GET
exports.category_create_get = function (req, res, next) {
  res.render("category_form_create", { title: "Create Category" });
};

// Handle category create on POST
exports.category_create_post = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Category title length must be 1-100 characters")
    .escape(),
  body("description")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Description required.")
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const category = new Category({
      title: req.body.title,
      description: req.body.description,
    });
    if (!errors.isEmpty()) {
      res.render("category_form_create", {
        title: "Create Category",
        category: category,
        errors: errors.array(),
      });
    } else {
      Category.findOne({ title: category.title }).exec(function (
        err,
        found_category
      ) {
        if (err) {
          return next(err);
        }
        if (found_category) {
          res.redirect(found_category.url);
        } else {
          category.save(function (err) {
            if (err) {
              return next(err);
            }
            res.redirect(category.url);
          });
        }
      });
    }
  },
];

// Display category delete form on GET
exports.category_delete_get = function (req, res, next) {
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
      if (results.category === null) {
        res.redirect("/categories");
      }
      res.render("category_form_delete", {
        title: "Delete Category",
        category: results.category,
        category_products: results.category_products,
      });
    }
  );
};

// Handle category delete form on POST
exports.category_delete_post = function (req, res, next) {
  async.parallel(
    {
      category: function (callback) {
        Category.findById(req.body.category_id).exec(callback);
      },
      category_products: function (callback) {
        Product.find({ category: req.body.category_id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.category_products.length > 0) {
        res.render("category_form_delete", {
          title: "Delete Category",
          category: results.category,
          category_products: results.category_products,
        });
        return;
      }
      if (results.category === null) {
        res.redirect("/categories");
        return;
      } else {
        Category.findByIdAndDelete(req.body.category_id, function (err) {
          if (err) {
            return next(err);
          }
          res.redirect("/categories");
        });
      }
    }
  );
};

// Display category update form on GET
exports.category_update_get = function (req, res, next) {
  res.send("NOT IMPLEMENTED: Category update form GET");
};

// Handle category update form on POST
exports.category_update_post = function (req, res, next) {
  res.send("NOT IMPLEMENTED: Category update form POST");
};
