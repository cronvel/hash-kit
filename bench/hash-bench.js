
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


