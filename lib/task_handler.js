var TaskHandler;

var spawn = require('child_process').spawn;
var fs = require('fs');

TaskHandler = function(){
    var _this = this;

    var init = function(){};

    var stop = function(pid, signal, callback){
        var sig = signal || 'SIGINT';
        if ( typeof(pid) != 'undefined') {
            try {
                process.kill(pid, sig);
                callback(false);
            } catch(err) { //Avoid ESRCH errors.
                //just ignore it.. Means that the process is already dead..
                callback(false);
            }
        } else {
            callback('TaskHandler Error: could not "stop" process: pid was not defined ('+pid+')');
        }
    };

    var restart = function(pid, bundle, env){
        stop(pid, null, function onStopped (err){
            if (!err) {
                console.log('Bundle ['+bundle+'] now restarting ('+env+').');
                setTimeout( function(){
                    start(bundle, env);
                }, 1000);
            }
        });
    };

    var start = function(bundle, env, callback){
        var version = process.getVersion(bundle);
        var out = fs.openSync('./out.'+bundle+'.'+version+'.log', 'a');
        var err = fs.openSync('./out.'+bundle+'.'+version+'.log', 'a');

        var nodePath = getPath('node');
        var geenaPath = _( getPath('root') +'/geena');

        var env = env || 'prod';
        try {
            var prc = spawn(
                nodePath, [
                    geenaPath,
                    '-s',
                    bundle,
                    env
                ],
                {
                    detached : true,
                    stdio: [ 'ignore', out, err ]
                }
            );

//            prc.on.stderr('data', function(err){
//                console.error(err.stack);
//            });

            if ( typeof(callback) != 'undefined' ) {
                setTimeout( function(){
                    callback(false);
                }, 300);//Avoid concurency on .gna/locals.
            }
        } catch (err) {
            if ( typeof(callback) != 'undefined' ) {
                callback(err)
            } else {
                console.error(err.stack);
            }
        }
    };

    this.process = function(opt, callback){
        _this.opt = opt;
        try {
            switch (opt.task) {
                case 'start' :
                    start(opt.bundle, opt.env, function onStartDone(err){
                        callback(err);
                    });
                    break;
                case 'stop' :
                    stop(opt.pid, null, function onStopped(err, pid){
                        if (!err) {
                            console.log("process ["+pid+"] stopped with success.")
                        }
                    });
                    break;
                case 'restart' :
                    restart(opt.pid, opt.bundle, opt.env);
                    break;

                default:
                    console.error('No task found: ', opt.task);
            }
        } catch (err) {
            console.error(err, err.stack);
        }
    };

    this.startAllBundles = function(config, callback, i){
        var bundles = config.bundles;
        var env = config.env;
        var b = i || 0;
        console.log('bundle...', bundles[b]);
        if (bundles[b] != 'shutdown') {
            start(bundles[b], env, function onStarted(err){
                if (err) console.error(err.stack);

                ++b;
                if (b == bundles.length) {
                    callback(false);
                } else {
                    _this.startAllBundles(config, callback, b);
                }
            });
        } else {
            ++b;
            if (b == bundles.length) {
                callback(false);
            } else {
                _this.startAllBundles(config, callback, b);
            }
        }
    };

    this.stopAllBundles = function(bundles, sig, callback, i){
        var b = i || 0;
        var signal = sig || 'SIGINT';

        if (bundles[b].name != 'shutdown') {
            stop(bundles[b].pid, signal,  function onKilled(err){
                if (err) console.error(err.stack);

                //Removing file.
                try {
                    fs.unlinkSync(bundles[b].path);
                } catch (err) {
                    //this juct means that it has already been removed by geena.
                }

                ++b;
                if (b == bundles.count() ) {
                    callback(false);
                } else {
                    _this.stopAllBundles(bundles, signal, callback, b);
                }
            });
        } else {
            ++b;
            if (b == bundles.count() ) {
                callback(false);
            } else {
                _this.stopAllBundles(bundles, signal, callback, b);
            }
        }
    };


    init();
};

module.exports = TaskHandler;