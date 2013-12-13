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

            //var token = appConfig.shutdownService.token;
        } catch (err){
            logger.error(
                'shutdown',
                'SHUTDOWN:CONTROLLER:ERR:1',
                err,
                __stack
            );
        }
        this.renderJSON({status:"ok"});
    }
};

module.exports = ShutdownController;