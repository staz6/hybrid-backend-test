const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller');
const sellerController = require('../controllers/seller-controller');

router.post(
    "/create-catalog",
    authController.authenticateSeller,
    sellerController.createCatalog
  );

module.exports = router;