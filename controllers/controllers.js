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
            var bundle  = req.param("bundle") ;
            var pid     = req.param("pid") ;
            var task    = req.param("task");
            var env     = req.param("env") || 'prod';
            //var token = appConfig.shutdownService.token;

            taskHandler = getContext("taskHandler");
            console.log("killing process ", pid);
            taskHandler.process({
                task    : task,
                pid     : pid,
                bundle  : bundle,
                env     : env
            });

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