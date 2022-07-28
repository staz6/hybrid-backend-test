const catchAsync = require('../services/catchAsync.js');


const test = catchAsync(async (req, res, next) =>{
    console.log("auth work")

})


module.exports={
    test
}