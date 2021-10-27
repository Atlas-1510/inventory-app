const express = require("express");
const router = express.Router();

// GET brands page
router.get("/", function (req, res, next) {
  res.send("This is the BRANDS page");
});

// GET request for creating a brand
router.get("/create", function (req, res, next) {
  res.send("This is the CREATE BRAND page");
});

// POST request for creating a brand
router.post("/create", function (req, res, next) {
  res.send("This is the POST page for CREATING a BRAND");
});

// GET request to delete a brand
router.get("/:id/delete", function (req, res, next) {
  res.send(`This is the DELETE BRAND page for ID: ${req.params.id}`);
});

// POST request to delete a brand
router.post("/:id/delete", function (req, res, next) {
  res.send(
    `This is the POST page for DELETING a BRAND with an ID of: ${req.params.id}`
  );
});

// GET request to update a brand
router.get("/:id/update", function (req, res, next) {
  res.send(`This is the UPDATE BRAND page for ID: ${req.params.id}`);
});

// POST request to update a brand
router.post("/:id/update", function (req, res, next) {
  res.send(
    `This is the POST page for UPDATING a BRAND with an ID of: ${req.params.id}`
  );
});

// GET request for one brand
router.get("/:id", function (req, res, next) {
  const id = req.params.id;
  res.send(`This is the BRAND page for ID: ${id}`);
});

module.exports = router;
