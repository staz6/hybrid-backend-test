const misc_service = require('../services/misc-service');
const User = require('../models/user-model');
const bcrypt = require('bcryptjs');

const catchAsync = require('../services/catchAsync.js');


const user_registeration = catchAsync(async (req, res, next) => {
    console.log(req.body)
    let user_info = misc_service.select_fields(req.body, [
        'userName',
         'type',
         'password'

      ]);
    
      let user_instance = new User(user_info);
      bcrypt
          .genSalt(Number(process.env.SALT_ROUNDS))
          .then(function (salt) {
            bcrypt
              .hash(req.body.password, salt)
              .then(function (hash) {
                  console.log(hash)
                user_instance.password = hash;
                user_instance
                .save()
                .then(function (new_user) {
                return res.send({
                    status: true,
                    message: 'User registered successfully',
                    response: {},
                });
                })
                .catch((err) => {
                console.log(err);
                if (11000 === err.code || 11001 === err.code) {
                    return res.status(400).send({
                    status: false,
                    message: 'Username already exists',
                    });
                } else {
                    logger.log(err);
                    return next(err);
                }
                });
              })
          }).catch((err)=>{
            return res.status(400).send({
                status: false,
                message: 'Password not found',
                });
          })
      
      
  });




module.exports={
    user_registeration
}