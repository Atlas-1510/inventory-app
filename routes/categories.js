const express = require("express");
const router = express.Router();

// GET categories page
router.get("/", (req, res, next) => {
  res.send("This is the CATEGORIES page");
});

// GET request for creating a category
router.get("/create", function (req, res, next) {
  res.send("This is the CREATE CATEGORY page");
});

// POST request for creating a category
router.post("/create", function (req, res, next) {
  res.send("This is the POST page for CREATING a CATEGORY");
});

// GET request to delete a category
router.get("/:id/delete", function (req, res, next) {
  res.send(`This is the DELETE CATEGORY page for ID: ${req.params.id}`);
});

// POST request to delete a category
router.post("/:id/delete", function (req, res, next) {
  res.send(
    `This is the POST page for DELETING a CATEGORY with an ID of: ${req.params.id}`
  );
});

// GET request to update a category
router.get("/:id/update", function (req, res, next) {
  res.send(`This is the UPDATE CATEGORY page for ID: ${req.params.id}`);
});

// POST request to update a category
router.post("/:id/update", function (req, res, next) {
  res.send(
    `This is the POST page for UPDATING a CATEGORY with an ID of: ${req.params.id}`
  );
});

// GET request for one category
router.get("/:id", function (req, res, next) {
  const id = req.params.id;
  res.send(`This is the CATEGORY page for ID: ${id}`);
});

module.exports = router;
