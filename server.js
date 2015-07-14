'use strict';

var Hapi = require( 'hapi' );
var fs   = require('fs');

var server = new Hapi.Server( {
	debug : {
		log : [ 'info', 'error' ]
	}
} );

server.connection( {
	port   : process.env.PORT || 3000,
	routes : {
		cors : true
	}
} );

server.route( {
	path    : '/test',
	method  : 'GET',
	handler : function ( request, reply ) {
		reply.file( './public/production.html' );
	}
} );

server.route({
    path    : '/fingerprints/{params*}',
    method  : 'GET',
    handler : {
        directory : {
            path    : 'fingerprints',
            listing : true
        }
    }
});

server.route( {
	path    : '/process-fingerprint',
	method  : 'POST',
	handler : function ( request, reply ) {
		var item = {
			uniqueS : JSON.parse( request.payload.wscreen ),
			uniqueN : JSON.parse( request.payload.wnavigator )
		}

		item = JSON.stringify(item).replace( 'uniqueS', 'window.screen' );
		item = item.replace( 'uniqueN', 'window.navigator' );


		fs.writeFile( './fingerprints/javascript' + ( new Date() / 1 ) + '.txt', item, function(err) {
			if(err) {
				return reply(err);
			}

			reply("The file was saved!");
		});
	}
} );

server.start( function ( err ) {
	if ( err ) { throw err; }
	server.log( 'info', 'Server running at: ' + server.info.uri );
} );

module.exports = server;
