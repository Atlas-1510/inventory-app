const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BrandSchema = new Schema({
  title: { type: String, maxlength: 100, required: true },
  description: { type: String },
});

BrandSchema.virtual("url").get(function () {
  return `/brands/${this._id}`;
});

module.exports = mongoose.model("Brand", BrandSchema);
