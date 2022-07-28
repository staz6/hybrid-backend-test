const misc_service = require("../services/misc-service");
const User = require("../models/user-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const catchAsync = require("../services/catchAsync.js");


/**
 * @desc      User for registering new user, use bcrypt to hash the password
 * @author   Aahad
 * @param    {JSON} {userName:string,type:seller/buyer/,password:""}
 * @return   {BOOL} registeration status
 */

const user_registeration = catchAsync(async (req, res, next) => {
  // get body object
  let user_info = misc_service.select_fields(req.body, [
    "userName",
    "type",
    "password",
  ]);
  
  //initialize new user instance
  let user_instance = new User(user_info);
  
  //Using bcrypt to generate password hash

  bcrypt
    .genSalt(Number(process.env.SALT_ROUNDS))
    .then(function (salt) {
      bcrypt.hash(req.body.password, salt).then(function (hash) {
        user_instance.password = hash;
        // If hash is succesfull store the user with new generated hash
        user_instance
          .save()
          .then(function (new_user) {
            return res.send({
              status: true,
              message: "User registered successfully",
              response: {},
            });
          })
          .catch((err) => {
            // else throw the error
            if (11000 === err.code || 11001 === err.code) {
              return res.status(400).send({
                status: false,
                message: "Username already exists",
              });
            } else {
              logger.log(err);
              return next(err);
            }
          });
      });
    })
    .catch((err) => {
      return res.status(400).send({
        status: false,
        message: "Password not found",
      });
    });
});


/**
 * @desc      Login function, use bcrypt to check the password and jwt to generate the token
 * @author   Aahad
 * @param    {JSON} {status:string,message:string,token:"",responseType:""}
 * @return   {object} Newly generated token
 */

const login = catchAsync(async (req, res, next) => {
  User.findOne({ userName: req.body.userName })
    .exec()
    .then(function (user) {
      // compare body password and user password hash.
      bcrypt.compare(req.body.password, user.password).then(async (match) => {
        if (match) {
          // add payload object token and generate a new token use super_secret
          let payload = { userName: req.body.userName, type: user.type };
          let token = jwt.sign(payload, process.env.SUPER_SECRET);
          return res.json({
            status: true,
            message: "Login Successful",
            response: token,
            type: "LOGIN_SUCCESS",
          });
        } else {
          return res.status(400).send({
            status: false,
            message: "Incorrect password",
          });
        }
      });
    })
    .catch(() => {
      return res.status(400).send({
        status: false,
        message: "Username not found",
      });
    });
});

/**
 * @desc     Seller authenticate middleware
 * @author   Aahad
 * @return   {Bool} next()
 */

const authenticateSeller = catchAsync(async (req, res, next) => {
  //check for the authorization header
  if (!req.headers["authorization"] || req.headers["authorization"] == "") {
    return res.send({
      status: false,
      message: "No token in headers",
    });
  }
  //decode the jwt token in header for further use
  var decoded = jwt.decode(req.headers["authorization"]);

  if (decoded) {
    User.findOne({ userName: decoded.userName }).then((user) => {
      if (!user || user.type !== "seller") {
        res.status(500).send({
          status: false,
          message: "Not authroize",
        });
      } else {
        // assign a user poperty to req, so other functions can utilize it
        req.user = user;
        next();
      }
    });
  } else {
    return res.send({
      status: false,
      message: "Invalid token",
    });
  }
});


/**
 * @desc     Buyter authenticate middleware. I have speerated the logic because its way easier to deal with roles if they are treated
 *           as sperate entity. Works the same as seller middleware
 * @author   Aahad
 * @return   {Bool} next()
 */

const authenticateBuyer = catchAsync(async (req, res, next) => {
  if (!req.headers["authorization"] || req.headers["authorization"] == "") {
    return res.send({
      status: false,
      message: "No token in headers",
    });
  }

  var decoded = jwt.decode(req.headers["authorization"]);
  if (decoded) {
    User.findOne({ userName: decoded.userName }).then((user) => {
      if (!user || user.type !== "buyer") {
        res.status(500).send({
          status: false,
          message: "Not authroize",
        });
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    return res.send({
      status: false,
      message: "Invalid token",
    });
  }
});

module.exports = {
  user_registeration,
  authenticateSeller,
  authenticateBuyer,
  login,
};
