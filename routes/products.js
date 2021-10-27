const express = require("express");
const router = express.Router();

// GET products page
router.get("/", function (req, res, next) {
  res.send("This is the PRODUCTS page");
});

// GET request for creating a product
router.get("/create", function (req, res, next) {
  res.send("This is the CREATE PRODUCT page");
});

// POST request for creating a product
router.post("/create", function (req, res, next) {
  res.send("This is the POST page for CREATING a PRODUCT");
});

// GET request to delete a product
router.get("/:id/delete", function (req, res, next) {
  res.send(`This is the DELETE PRODUCT page for ID: ${req.params.id}`);
});

// POST request to delete a product
router.post("/:id/delete", function (req, res, next) {
  res.send(
    `This is the POST page for DELETING a PRODUCT with an ID of: ${req.params.id}`
  );
});

// GET request to update a product
router.get("/:id/update", function (req, res, next) {
  res.send(`This is the UPDATE PRODUCT page for ID: ${req.params.id}`);
});

// POST request to update a product
router.post("/:id/update", function (req, res, next) {
  res.send(
    `This is the POST page for UPDATING a PRODUCT with an ID of: ${req.params.id}`
  );
});

// GET request for one product
router.get("/:id", function (req, res, next) {
  const id = req.params.id;
  res.send(`This is the product page for product ID: ${id}`);
});

module.exports = router;
