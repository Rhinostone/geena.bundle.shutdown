/**
 * Shutdown bundle
 * */

//Imports.
var shutdown = require('geena');
shutdown.onInitialize( function(event, app, express){
    var self = shutdown;
    //setContext('geena.utils', self.utils);
    var bundlePath =  self.getConfig().bundlePath;
    //Task handler
    var TaskHandler = require( _(bundlePath +"/lib/task_handler") );
    var taskHandler = new TaskHandler();
    setContext("taskHandler", taskHandler);
    //Express configuration.
//    app.configure( function() {
//        app.use( express.methodOverride() );
//    });
    event.emit("complete", app);
});
shutdown.start();