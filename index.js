/**
 * Shutdown bundle
 * */

//Imports.
var shutdown = require('geena');
//shutdown.onInitialize( function(event, app, express){
//    var self = shutdown;
//    setContext('geena.utils', self.utils);
//
//    //Express configuration.
//    app.configure( function() {
//        app.use( express.methodOverride() );
//    });
//    event.emit("complete", app);
//});
shutdown.start();