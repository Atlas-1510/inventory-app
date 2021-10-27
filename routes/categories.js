const express = require("express");
const router = express.Router();

const categoriesController = require("../controllers/categoryController");

// GET categories page
router.get("/", categoriesController.category_list);

// GET request for creating a category
router.get("/create", categoriesController.category_create_get);

// POST request for creating a category
router.post("/create", categoriesController.category_create_post);

// GET request to delete a category
router.get("/:id/delete", categoriesController.category_delete_get);

// POST request to delete a category
router.post("/:id/delete", categoriesController.category_delete_post);

// GET request to update a category
router.get("/:id/update", categoriesController.category_update_get);

// POST request to update a category
router.post("/:id/update", categoriesController.category_update_post);

// GET request for one category
router.get("/:id", categoriesController.category_detail);

module.exports = router;
