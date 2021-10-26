const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// TODO: Add brand logo

const BrandSchema = new Schema({
  title: { type: String, maxlength: 100, required: true },
  description: { type: String },
});

BrandSchema.virtual("url").get(() => {
  return `/brand/${this._id}`;
});

module.exports("Brand", BrandSchema);
