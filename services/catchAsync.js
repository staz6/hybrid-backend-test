/*  Helper function, this converts every api to a promise where 
fn is  api function and catch(err) will redirect the request to error handler middleware in error-controller
*/
module.exports = fn => {
    
    return(req,res,next) => {
        fn(req,res,next).catch(next)
    }
}