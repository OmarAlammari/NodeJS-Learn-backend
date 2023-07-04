
//custom Middleware (Application Middleware)
//logging
module.exports =(req, res, nxt) => {

    console.log('logging..');
    nxt();
}