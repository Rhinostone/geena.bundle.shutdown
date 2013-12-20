var ShutdownController;

//Imports.
var utils = require('geena').utils;
var logger = utils.logger;

ShutdownController = {

    /**
     * Take orders
     *
     * @param {object} options - JSON Options
     * */
    takeOrders : function(req, res){

        var _this = this;

        try {
            var bundle = JSON.parse( req.param("bundle") ) ;
            var pid =  JSON.parse( req.param("pid") ) ;
            var task = JSON.parse( req.param("task") );
            //var token = appConfig.shutdownService.token;
            console.log("killing process ", pid);
            setTimeout( function(){
                console.log("..wait for a sec and load task ");
                //switch & spawn ;)
            }, 1000);


        } catch (err){
            logger.error(
                'shutdown',
                'SHUTDOWN:CONTROLLER:ERR:1',
                err,
                err.stack
            );
        }
        this.renderJSON({status:"ok"});
    }
};

module.exports = ShutdownController;