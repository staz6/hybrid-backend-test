// Load MongoDB driver
var mongoose = require("mongoose");

var product_schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Product", product_schema);
