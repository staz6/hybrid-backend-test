const misc_service = require('../services/misc-service');
const User = require('../models/user-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

const login = catchAsync(async (req, res, next) => {
    
      User.findOne({userName:req.body.userName})
    .exec()
    .then(function (user) {
        bcrypt
          .compare(req.body.password, user.password)
          .then(async (match) => {
            if (match) {
                let payload = { userName: req.body.userName,type:user.type };
                let token = jwt.sign(payload, process.env.SUPER_SECRET);
                return res.json({
                  status: true,
                  message: 'Login Successful',
                  response: token,
                  type: 'LOGIN_SUCCESS',
                });
            }else{
                return res.status(400).send({
                    status: false,
                    message: 'Incorrect password',
                    });
            }
          })
        


    }).catch(()=>{
        return res.status(400).send({
            status: false,
            message: 'Username not found',
            });
    })

})


module.exports={
    user_registeration,
    login
}