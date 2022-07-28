const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller');
const sellerController = require('../controllers/seller-controller');

router.get(
    "/test",
    authController.authenticateSaler,
    sellerController.test
  );

module.exports = router;