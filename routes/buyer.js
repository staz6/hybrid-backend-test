const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller');
const buyerController = require('../controllers/buyer-controller');

router.get(
    "/list-of-sellers",
    authController.authenticateBuyer,
    buyerController.getSellers
  );

router.get(
    "/seller-catalog/:seller_id",
    authController.authenticateBuyer,
    buyerController.getSellerCatalog
)

router.post(
    "/create-order/:seller_id",
    authController.authenticateBuyer,
    buyerController.placeOrder
)

module.exports = router;