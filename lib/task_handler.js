var TaskHandler;

var spawn = require('child_process').spawn;

TaskHandler = function(){
    var _this = this;

    var init = function(){};

    var stop = function(pid, signal, callback){
        var sig = signal || 'SIGINT';
        if ( typeof(pid) != 'undefined') {
            process.kill(pid, sig);
            callback(false, pid);
        } else {
            callback('TaskHandler Error: could not "stop" process: pid was not defined');
        }
    };

    var restart = function(pid, bundle, env){
        stop(pid, null, function onStopped (err){
            if (!err) {
                console.log('Bundle ['+bundle+'] now restarting.');
                setTimeout( function(){
                    start(bundle, env);
                }, 1000);
            }
        });
    };

    var start = function(bundle, env){
        var env = env || 'prod';
        var prc = spawn(
            'node', [
                'geena',
                '-s',
                bundle,
                env
            ]
        );
    };

    this.process = function(opt){
        _this.opt = opt;
        try {
            switch (opt.task) {
                case 'start' :
                    start(opt.bundle, opt.env);
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


    init();
};

module.exports = TaskHandler;