#!/usr/bin/env node

"use strict" ;

const hash = require( '..' ) ;

var result = hash.computeChallengeHash( "grigrigredin menu fretin" , 20 , 'hex' ) ;

console.log( result ) ;

if ( hash.checkChallengeHash( "grigrigredin menu fretin" , result.counter , result.hash , 20 , 'hex' ) ) {
	console.log( "Verified: OK!" ) ;
}
else {
	console.log( "Verified: Not OK..." ) ;
}

