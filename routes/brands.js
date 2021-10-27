const express = require("express");
const router = express.Router();

const brand_controller = require("../controllers/brandController");

// GET brands page
router.get("/", brand_controller.brand_list);

// GET request for creating a brand
router.get("/create", brand_controller.brand_create_get);

// POST request for creating a brand
router.post("/create", brand_controller.brand_create_post);

// GET request to delete a brand
router.get("/:id/delete", brand_controller.brand_delete_get);

// POST request to delete a brand
router.post("/:id/delete", brand_controller.brand_delete_post);

// GET request to update a brand
router.get("/:id/update", brand_controller.brand_update_get);

// POST request to update a brand
router.post("/:id/update", brand_controller.brand_update_post);

// GET request for one brand
router.get("/:id", brand_controller.brand_detail);

module.exports = router;
