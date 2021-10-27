const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");

// GET products page
router.get("/", productController.product_list);

// GET request for creating a product
router.get("/create", productController.product_create_get);

// POST request for creating a product
router.post("/create", productController.product_create_post);

// GET request to delete a product
router.get("/:id/delete", productController.product_delete_get);

// POST request to delete a product
router.post("/:id/delete", productController.product_delete_post);

// GET request to update a product
router.get("/:id/update", productController.product_update_get);

// POST request to update a product
router.post("/:id/update", productController.product_update_post);

// GET request for one product
router.get("/:id", productController.product_detail);

module.exports = router;
