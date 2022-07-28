// Load MongoDB driver
var mongoose = require('mongoose');

var order_schema = new mongoose.Schema({
  buyerId:{
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  },
  sellerId:{
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  },
  productsId:[{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}]
});

module.exports = mongoose.model('Order', order_schema);
