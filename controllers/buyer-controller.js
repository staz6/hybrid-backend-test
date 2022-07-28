const catchAsync = require("../services/catchAsync");
const User = require('../models/user-model');
const Product = require('../models/product-model');
const Catalog = require('../models/catalog-model');

const getSellers = catchAsync(async (req, res, next) =>{
    var sellers = await User.find({type:"seller"},{userName:1,_id : 1})
    res.status(200).send({
        status: true,
        message: 'Seller get successfully',
        data:sellers
      });
})

const getSellerCatalog = catchAsync(async (req,res,next)=>{
    var catalog = await Catalog.findOne({userId:req.params.seller_id}).populate({
        path: 'userId',
        select: { userName:1},
      }).populate({
          path:"productsId"
      })
    
      res.status(200).send({
        status: true,
        message: 'Catalog get successfully',
        data:catalog
      });
})

module.exports={
    getSellers,getSellerCatalog
}