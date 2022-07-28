const catchAsync = require("../services/catchAsync");
const User = require("../models/user-model");
const Product = require("../models/product-model");
const Catalog = require("../models/catalog-model");
const Order = require("../models/order-model");
var ObjectID = require("mongodb").ObjectID;

/**
 * @desc     Get list of sellers
 * @author   Aahad
 * @param    {params} 
 * @return   {Obj} [sellers]
 */

const getSellers = catchAsync(async (req, res, next) => {
  var sellers = await User.find({ type: "seller" }, { userName: 1, _id: 1 });
  res.status(200).send({
    status: true,
    message: "Seller get successfully",
    data: sellers,
  });
});


/**
 * @desc     Get seller catalog
 * @author   Aahad
 * @param    {params} sellerId
 * @return   {Obj} Populated seller catalog object 
 */

const getSellerCatalog = catchAsync(async (req, res, next) => {
  var catalog = await Catalog.findOne({ userId: req.params.seller_id })
    .populate({
      path: "userId",
      select: { userName: 1 },
    })
    .populate({
      path: "productsId",
    });
  if (catalog) {
    res.status(200).send({
      status: true,
      message: "Catalog get successfully",
      data: catalog,
    });
  } else {
    res.status(402).send({
      status: false,
      message: "Catalog not found",
      data: [],
    });
  }
});


/**
 * @desc     Use for placing orders, take and array called products and seller Id
 * @author   Aahad
 * @param    {obj} {products:["productId","productId"]}
 * @return   {Bool} Confirmation status
 */

const placeOrder = catchAsync(async (req, res, next) => {
  const sellerId = req.params.seller_id;
  const products = req.body.products;
  var catalog = await Catalog.findOne({ userId: sellerId });

  //Checking if every products to belong to that seller
  const exist = products.every((value) => {
    return catalog.productsId.includes(value);
  });
  if (exist) {
    //If yes place the order
    let order = new Order({
      buyerId: req.user._id,
      sellerId: sellerId,
      productsId: products,
    });
    order.save();
    res.status(200).send({
      status: true,
      message: "Order Created sucessfully",
      data: exist,
    });
  } else {
    res.status(402).send({
      status: false,
      message: "Incorrect product selected",
      data: exist,
    });
  }
});

module.exports = {
  getSellers,
  getSellerCatalog,
  placeOrder,
};
