const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  title: { type: String, required: true, maxlength: 100 },
  description: { type: String, required: true },
});

CategorySchema.virtual("url").get(() => {
  return `/category/${this_id}`;
});

module.exports("Category", CategorySchema);
