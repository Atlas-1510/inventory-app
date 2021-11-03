const Product = require("../models/product");
const Brand = require("../models/brand");
const Category = require("../models/category");
const async = require("async");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Set up Multer image processing
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}-${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileName(file, cb);
  },
}).single("productImage");

function checkFileName(file, cb) {
  const types = /jpeg|jpg|gif|png/;
  const fileType = types.test(file.originalname.toLowerCase());
  const mimeType = types.test(file.mimetype);
  if (fileType && mimeType) {
    return cb(null, true);
  } else {
    return cb({ message: "Invalid file type" }, false);
  }
}

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
      res.render("product_form", {
        title: "Create Product",
        brands: results.brands,
        categories: results.categories,
      });
    }
  );
};

// Handle product create on POST
exports.product_create_post = [
  function (req, res, next) {
    upload(req, res, function (err) {
      if (err) {
        console.log("ERROR");
        console.log(err);
        req.imageError = err;
      }
      next();
    });
  },
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
    // Compile errors
    const errors = validationResult(req).array();
    if (req.imageError) {
      errors.push({ msg: req.imageError.message });
    }
    const product = new Product({
      title: req.body.title,
      price: req.body.price,
      rating: req.body.rating,
      quantity: req.body.quantity,
      brand: req.body.brand,
      category: req.body.category,
    });

    if (errors.length > 0) {
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

          // Delete temporary stored image
          if (req.file) {
            fs.unlink(req.file.path, (err) => {
              if (err) {
                console.log("error in fs");
              }
            });
          }
          res.render("product_form", {
            title: "Create Product",
            brands: results.brands,
            categories: results.categories,
            product: product,
            errors: errors,
          });
        }
      );
    } else {
      product.imageURL = `images/${req.file.filename}`;
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
  async.parallel(
    {
      product: function (callback) {
        Product.findById(req.params.id).exec(callback);
      },
      brands: function (callback) {
        Brand.find().exec(callback);
      },
      categories: function (callback) {
        Category.find().exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.product === null) {
        const err = new Error("Product not found");
        err.status = 404;
        return next(err);
      }
      results.brands.forEach((brand) => {
        if (brand.id === results.product.brand._id.toString()) {
          brand.checked = true;
        } else {
          brand.checked = false;
        }
      });
      results.categories.forEach((category) => {
        if (category.id === results.product.category._id.toString()) {
          category.checked = true;
        } else {
          category.checked = false;
        }
      });
      res.render("product_form", {
        title: "Update Product",
        product: results.product,
        brands: results.brands,
        categories: results.categories,
      });
    }
  );
};

// Handle product update form on POST
exports.product_update_post = [
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
    const product = new Product({
      title: req.body.title,
      price: req.body.price,
      rating: req.body.rating,
      quantity: req.body.quantity,
      brand: req.body.brand,
      category: req.body.category,
      _id: req.params.id,
    });
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
          res.render("product_form", {
            title: "Create Product",
            brands: results.brands,
            categories: results.categories,
            product: product,
            errors: errors.array(),
          });
        }
      );
    } else {
      Product.findByIdAndUpdate(
        req.params.id,
        product,
        {},
        function (err, updated_product) {
          if (err) {
            return next(err);
          }
          res.redirect(updated_product.url);
        }
      );
    }
  },
];
