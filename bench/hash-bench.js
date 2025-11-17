
/* global benchmark, competitor */



var hash = require( '../lib/hash.js' ) ;
var crypto = require( 'crypto' ) ;



benchmark( 'Hash a 40 bytes random strings' , function() {
	
	var sample = hash.randomIdentifier( 40 ) ;
	
	competitor( '.fingerprint()' , function() {
		hash.fingerprint( sample ) ;
	} ) ;
	
	competitor( '.hashKey()' , function() {
		hash.hashKey( sample ) ;
	} ) ;
	
	competitor( 'sha1 to base64' , function() {
		crypto.createHash( 'sha1' ).update( sample ).digest().toString( 'base64' ) ;
	} ) ;
	
	competitor( 'sha1 to hex' , function() {
		crypto.createHash( 'sha1' ).update( sample ).digest().toString( 'hex' ) ;
	} ) ;
	
	competitor( 'sha1 to ascii' , function() {
		crypto.createHash( 'sha1' ).update( sample ).digest().toString( 'ascii' ) ;
	} ) ;
	
	competitor( 'sha1 to binary' , function() {
		crypto.createHash( 'sha1' ).update( sample ).digest().toString( 'binary' ) ;
	} ) ;
	
	competitor( 'md5 to base64' , function() {
		crypto.createHash( 'md5' ).update( sample ).digest().toString( 'base64' ) ;
	} ) ;
} ) ;



benchmark( 'Hash a 100 bytes random strings' , function() {
	
	var sample = hash.randomIdentifier( 100 ) ;
	
	competitor( '.fingerprint()' , function() {
		hash.fingerprint( sample ) ;
	} ) ;
	
	competitor( '.hashKey()' , function() {
		hash.hashKey( sample ) ;
	} ) ;
	
	competitor( 'sha1 to base64' , function() {
		crypto.createHash( 'sha1' ).update( sample ).digest().toString( 'base64' ) ;
	} ) ;
	
	competitor( 'sha1 to hex' , function() {
		crypto.createHash( 'sha1' ).update( sample ).digest().toString( 'hex' ) ;
	} ) ;
	
	competitor( 'sha1 to ascii' , function() {
		crypto.createHash( 'sha1' ).update( sample ).digest().toString( 'ascii' ) ;
	} ) ;
	
	competitor( 'sha1 to binary' , function() {
		crypto.createHash( 'sha1' ).update( sample ).digest().toString( 'binary' ) ;
	} ) ;
	
	competitor( 'md5 to base64' , function() {
		crypto.createHash( 'md5' ).update( sample ).digest().toString( 'base64' ) ;
	} ) ;
} ) ;



benchmark( 'Hash a 1000 bytes random strings' , function() {
	
	var sample = hash.randomIdentifier( 1000 ) ;
	
	competitor( '.fingerprint()' , function() {
		hash.fingerprint( sample ) ;
	} ) ;
	
	competitor( '.hashKey()' , function() {
		hash.hashKey( sample ) ;
	} ) ;
	
	competitor( 'sha1 to base64' , function() {
		crypto.createHash( 'sha1' ).update( sample ).digest().toString( 'base64' ) ;
	} ) ;
	
	competitor( 'sha1 to hex' , function() {
		crypto.createHash( 'sha1' ).update( sample ).digest().toString( 'hex' ) ;
	} ) ;
	
	competitor( 'sha1 to ascii' , function() {
		crypto.createHash( 'sha1' ).update( sample ).digest().toString( 'ascii' ) ;
	} ) ;
	
	competitor( 'sha1 to binary' , function() {
		crypto.createHash( 'sha1' ).update( sample ).digest().toString( 'binary' ) ;
	} ) ;
	
	competitor( 'md5 to base64' , function() {
		crypto.createHash( 'md5' ).update( sample ).digest().toString( 'base64' ) ;
	} ) ;
} ) ;



benchmark( 'Hash a 10KB random strings' , function() {
	
	var sample = hash.randomIdentifier( 10000 ) ;
	
	competitor( '.fingerprint()' , function() {
		hash.fingerprint( sample ) ;
	} ) ;
	
	competitor( '.hashKey()' , function() {
		hash.hashKey( sample ) ;
	} ) ;
	
	competitor( 'sha1 to base64' , function() {
		crypto.createHash( 'sha1' ).update( sample ).digest().toString( 'base64' ) ;
	} ) ;
	
	competitor( 'sha1 to hex' , function() {
		crypto.createHash( 'sha1' ).update( sample ).digest().toString( 'hex' ) ;
	} ) ;
	
	competitor( 'sha1 to ascii' , function() {
		crypto.createHash( 'sha1' ).update( sample ).digest().toString( 'ascii' ) ;
	} ) ;
	
	competitor( 'sha1 to binary' , function() {
		crypto.createHash( 'sha1' ).update( sample ).digest().toString( 'binary' ) ;
	} ) ;
	
	competitor( 'md5 to base64' , function() {
		crypto.createHash( 'md5' ).update( sample ).digest().toString( 'base64' ) ;
	} ) ;
} ) ;



benchmark( 'Random Number Generators' , function() {
	
	var drng = new hash.DRNG() ,
		topic = "player:bob,type:battle" ,
		seed16 = hash.randomBase64( 16 ) ,
		drng16 = new hash.DRNG( seed16 ) ,
		drng16md5 = new hash.DRNG( seed16 , 'md5' ) ,
		result ;
	
	competitor( 'Vanilla Math.random()' , function() {
		result =
			Math.random() + Math.random() + Math.random() + Math.random() + Math.random() +
			Math.random() + Math.random() + Math.random() + Math.random() + Math.random() ;
	} ) ;

	competitor( 'Hash Kit Deterministic RNG: hash.DRNG() with default seed (32 bytes)' , function() {
		result =
			drng.random( topic ) + drng.random( topic ) + drng.random( topic ) + drng.random( topic ) + drng.random( topic ) +
			drng.random( topic ) + drng.random( topic ) + drng.random( topic ) + drng.random( topic ) + drng.random( topic ) ;
	} ) ;
	
	competitor( 'Hash Kit Deterministic RNG: hash.DRNG() with a 16 bytes seed' , function() {
		result =
			drng16.random( topic ) + drng16.random( topic ) + drng16.random( topic ) + drng16.random( topic ) + drng16.random( topic ) +
			drng16.random( topic ) + drng16.random( topic ) + drng16.random( topic ) + drng16.random( topic ) + drng16.random( topic ) ;
	} ) ;
	
	competitor( 'Hash Kit Deterministic RNG: hash.DRNG() with a 16 bytes seed and MD5 algo' , function() {
		result =
			drng16md5.random( topic ) + drng16md5.random( topic ) + drng16md5.random( topic ) + drng16md5.random( topic ) + drng16md5.random( topic ) +
			drng16md5.random( topic ) + drng16md5.random( topic ) + drng16md5.random( topic ) + drng16md5.random( topic ) + drng16md5.random( topic ) ;
	} ) ;
	
	competitor( 'Hash Kit hash.random(): using crypto.pseudoRandomBytes()' , function() {
		result =
			hash.random( false ) + hash.random( false ) + hash.random( false ) + hash.random( false ) + hash.random( false ) +
			hash.random( false ) + hash.random( false ) + hash.random( false ) + hash.random( false ) + hash.random( false ) ;
	} ) ;

	competitor( 'Hash Kit hash.random(): using crypto.randomBytes()' , function() {
		result =
			hash.random( true ) + hash.random( true ) + hash.random( true ) + hash.random( true ) + hash.random( true ) +
			hash.random( true ) + hash.random( true ) + hash.random( true ) + hash.random( true ) + hash.random( true ) ;
	} ) ;

	competitor( 'Baseline crypto.pseudoRandomBytes(4)' , function() {
		crypto.pseudoRandomBytes( 4 ) ; crypto.pseudoRandomBytes( 4 ) ; crypto.pseudoRandomBytes( 4 ) ; crypto.pseudoRandomBytes( 4 ) ; crypto.pseudoRandomBytes( 4 ) ;
		crypto.pseudoRandomBytes( 4 ) ; crypto.pseudoRandomBytes( 4 ) ; crypto.pseudoRandomBytes( 4 ) ; crypto.pseudoRandomBytes( 4 ) ; crypto.pseudoRandomBytes( 4 ) ;
	} ) ;

	competitor( 'Baseline crypto.pseudoRandomBytes(40)' , function() {
		crypto.pseudoRandomBytes( 40 ) ;
	} ) ;
} ) ;

