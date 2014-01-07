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

        } catch (err) {
            logger.error(
                'shutdown',
                'SHUTDOWN:CONTROLLER:ERR:1',
                err,
                err.stack
            );
        }
        this.renderJSON({status:"ok"});
    },

    /**
     * Start bundle
     *
     * @param {object} options - JSON Options
     * */
    startBundle : function(req, res){

        var _this = this;

        try {
            var bundle  = req.param("bundle") ;
            var task    = req.param("task");
            var env     = req.param("env") || 'prod';
            //var token = appConfig.shutdownService.token;

            taskHandler = getContext("taskHandler");
            console.log("starting bundle ", bundle);
            taskHandler.process({
                task    : task,
                pid     : null,
                bundle  : bundle,
                env     : env
            }, function onStarted(err){
                _this.renderJSON({status:"ok"});
            });


        } catch (err) {
            logger.error(
                'shutdown',
                'SHUTDOWN:CONTROLLER:ERR:2',
                err,
                err.stack
            );
            this.renderJSON({status:"ko"});
        }

    },
    startAllBundles : function(req, res){
        var _this = this;
        var env     = req.param("env") || 'prod';
        var config  = this.getConfig();
        var conf = {
            'bundlesPath'   : config.bundlesPath,
            'bundles'       : process.getMountedBundlesSync(),
            'env'           : env
        };

        taskHandler = getContext("taskHandler");
        taskHandler.startAllBundles(conf, function onStarted(err){
            if(err)
                console.error(err)
            else
                console.log("All bundles started with success");

            _this.renderJSON({status:"ok"});
        });
    },
    stopAllBundles : function(req, res){

        var _this = this;
        var runnunigBundles = process.getRunningBundlesSync();

        if (runnunigBundles.count() > 0) {
            taskHandler = getContext("taskHandler");
            taskHandler.stopAllBundles(runnunigBundles, 'SIGINT', function onStarted(err){
                if(err)
                    console.error(err)
                else
                    console.log("All bundles started with success");

                _this.renderJSON({status:"ok"});
            });
        } else {
            _this.renderJSON({status:"ok"});
        }

    }
};

module.exports = ShutdownController;