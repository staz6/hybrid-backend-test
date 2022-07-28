const catchAsync = require("../services/catchAsync.js");
const misc_service = require("../services/misc-service");
const User = require("../models/user-model");
const Product = require("../models/product-model");
const Catalog = require("../models/catalog-model");
const Order = require("../models/order-model");


/**
 * @desc     Generate catalogs if not exist or push the products into an existing catalog
 * @author   Aahad
 * @param    {JSON} [{
 *                    "name":"product A",
		                  "price":12
 *                     }]
 * @return   {Bool} Confirmation status
 */
const createCatalog = catchAsync(async (req, res, next) => {
  try {
    let user = await User.findOne({ _id: req.user._id });
    if (user) {
      //Check if catalog exist for that user
      var catalog = await Catalog.findOne({ userId: req.user._id });
      //If not create one and override above catalog
      if (!catalog) {
        catalog = new Catalog({ userId: user._id });
      }
      //Insert the producst array into the products model, and then push each product Id to catalog
      Product.insertMany(req.body)
        .then((products) => {
          // pushing products id into catalog
          for (var item in products) {
            catalog.productsId.push(products[item]._id);
          }
          catalog.save();
          res.status(200).send({
            status: true,
            message: "Product created successfully",
          });
        })
        .catch((err) => {
          res.status(400).send({
            status: true,
            message: "Sorry something went wrong please try again late",
          });
        });
    }
  } catch {
    res.status(400).send({
      status: false,
      message: "Sorry something went wrong please try again late",
    });
  }
});

/**
 * @desc     Get the seller Id from token and return his orders
 * @author   Aahad
 * @param    {params} token
 * @return   {Bool} Confirmation status
 */

const getOrders = catchAsync(async (req, res, next) => {
  const sellerId = req.user._id;
  orders = await Order.find({ sellerId: sellerId })
    .populate({
      path: "buyerId",
      select: { userName: 1 },
    })
    .populate({
      path: "productsId",
    });
  console.log(orders);
  if (orders) {
    res.status(200).send({
      status: true,
      message: "Order get successfully",
      data: orders,
    });
  } else {
    res.status(402).send({
      status: false,
      message: "Orders not found",
      data: [],
    });
  }
});

module.exports = {
  createCatalog,
  getOrders,
};
