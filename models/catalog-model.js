// Load MongoDB driver
var mongoose = require('mongoose');

var catalog_schema = new mongoose.Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  },
  productsId:[{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}]
});

module.exports = mongoose.model('Catalog', catalog_schema);
