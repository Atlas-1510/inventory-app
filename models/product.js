const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// TODO: Add product image

const ProductSchema = new Schema({
  title: { type: String, required: true, maxlength: 100 },
  price: { type: Number, required: true, min: 0 },
  rating: { type: Number, required: true, enum: [1, 2, 3, 4, 5] },
  brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  quantity: { type: Number, required: true, min: 0 },
});

// Virtual for product URL
ProductSchema.virtual("url").get(() => {
  return `/products/${this._id}`;
});

module.exports = mongoose.model("Product", ProductSchema);
