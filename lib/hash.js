/*
	Hash Kit

	Copyright (c) 2014 - 2020 Cédric Ronvel

	The MIT License (MIT)

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
*/

"use strict" ;



const crypto = require( 'crypto' ) ;

const UINT32_COUNT = 4294967296 ;



// Create the object and export
const hash = {} ;
module.exports = hash ;



/*
	options:
		url: base64url
		noPad: remove padding '=' chars
*/
hash.base64Encode = ( input , options ) => {
	var buffer ;

	if ( ! options || typeof options !== 'object' ) { options = {} ; }

	// If necessary, convert to Buffer
	if ( input instanceof Buffer ) { buffer = input ; }
	else if ( typeof input === 'string' ) { buffer = Buffer.from( input ) ; }
	else if ( typeof input === 'number' ) { buffer = Buffer.allocUnsafe( 6 ) ; buffer.writeUIntBE( input , 0 , 6 ) ; }
	else { throw new TypeError( '[hash-kit] .base64Encode() expect argument #0 to be a Buffer, a string or a number' ) ; }

	// Convert buffer to base64
	var output = buffer.toString( 'base64' ) ;

	// If url option is on, then convert to base64 URL
	if ( options.url ) {
		//output = output.replace( /\+/g , '-' ).replace( /\//g , '_' ).replace( /[=]{1,2}$/g , '' ) ;
		output = output.replace( /[+/=]/g , match => {
			if ( match === '+' ) { return '-' ; }
			if ( match === '/' ) { return '_' ; }
			return '' ;
		} ) ;
	}
	else if ( options.noPad ) {
		output = output.replace( /[=]{1,2}$/g , '' ) ;
	}

	return output ;
} ;



hash.base64Decode = ( input , options ) => {
	if ( ! options || typeof options !== 'object' ) { options = {} ; }

	if ( typeof input !== 'string' ) { input = '' ; }

	var output ;

	// Create a buffer with the input
	// Buffer.from() accept padding-stripped base64
	output = Buffer.from( input , 'base64' ) ;

	if ( options.to ) {
		switch ( options.to ) {
			case 'integer' :
				output = output.readUIntBE( 0 , 6 ) ;
				break ;
			default :
				output = output.toString( options.to ) ;
		}
	}

	return output ;
} ;



hash.fingerprint = data => {
	// Note: SHA1 is as fast as MD5 nowadays

	if ( typeof data === 'string' ) {
		return hash.base64Encode( crypto.createHash( 'sha1' ).update( data )
			.digest() , { url: true } ) ;
	}

	if ( typeof data === 'number' ) {
		var buffer = Buffer.allocUnsafe( 8 ) ;
		buffer.writeDoubleLE( data , 0 ) ;
		return hash.base64Encode( buffer , { url: true } ) ;
	}

	if ( data && typeof data === 'object' ) {
		return hash.base64Encode( crypto.createHash( 'sha1' ).update( JSON.stringify( data ) )
			.digest() , { url: true } ) ;
	}

	return undefined ;
} ;



// 50% faster than fingerprint, suitable for dictionary keys
// Note: SHA1 is as fast as MD5 nowadays
hash.hashKey = str => crypto.createHash( 'sha1' ).update( str )
	.digest()
	.toString( 'base64' ) ;

// Do not expect ultimate uniqueness, also it is valid for most non-database use-cases
hash.tinyId = () => hash.base64Encode( crypto.pseudoRandomBytes( 6 ) , { url: true } ) ;

// Generate a random unique id
hash.uniqueId = hash.uniqId = () => hash.fingerprint( '' + Date.now() + crypto.pseudoRandomBytes( 4 ).readUInt32LE( 0 , true ) ) ;


// Generate a password hash
hash.password = ( pw , salt , algo ) => {
	if ( typeof pw !== 'string' ) { throw new TypeError( '[hash] .password(): arguments #0 should be a string' ) ; }
	if ( typeof salt !== 'string' ) { salt = '' ; }
	if ( typeof algo !== 'string' ) { algo = 'sha512' ; }

	return crypto.createHash( algo ).update( salt + pw )
		.digest()
		.toString( 'base64' ) ;
} ;



// Replacement of Math.random() using crypto
hash.random = useEntropy => ( useEntropy ? crypto.randomBytes : crypto.pseudoRandomBytes )( 4 ).readUInt32LE( 0 , true ) / UINT32_COUNT ;



const LOWCASE_ALPHA = [
	'a' , 'b' , 'c' , 'd' , 'e' , 'f' , 'g' , 'h' , 'i' , 'j' , 'k' , 'l' , 'm' ,
	'n' , 'o' , 'p' , 'q' , 'r' , 's' , 't' , 'u' , 'v' , 'w' , 'x' , 'y' , 'z'
] ;

const ALPHA = [
	'a' , 'b' , 'c' , 'd' , 'e' , 'f' , 'g' , 'h' , 'i' , 'j' , 'k' , 'l' , 'm' ,
	'n' , 'o' , 'p' , 'q' , 'r' , 's' , 't' , 'u' , 'v' , 'w' , 'x' , 'y' , 'z' ,
	'A' , 'B' , 'C' , 'D' , 'E' , 'F' , 'G' , 'H' , 'I' , 'J' , 'K' , 'L' , 'M' ,
	'N' , 'O' , 'P' , 'Q' , 'R' , 'S' , 'T' , 'U' , 'V' , 'W' , 'X' , 'Y' , 'Z'
] ;

const LOWCASE_ALPHANUM = [
	'0' , '1' , '2' , '3' , '4' , '5' , '6' , '7' , '8' , '9' ,
	'a' , 'b' , 'c' , 'd' , 'e' , 'f' , 'g' , 'h' , 'i' , 'j' , 'k' , 'l' , 'm' ,
	'n' , 'o' , 'p' , 'q' , 'r' , 's' , 't' , 'u' , 'v' , 'w' , 'x' , 'y' , 'z'
] ;

const ALPHANUM = [
	'0' , '1' , '2' , '3' , '4' , '5' , '6' , '7' , '8' , '9' ,
	'a' , 'b' , 'c' , 'd' , 'e' , 'f' , 'g' , 'h' , 'i' , 'j' , 'k' , 'l' , 'm' ,
	'n' , 'o' , 'p' , 'q' , 'r' , 's' , 't' , 'u' , 'v' , 'w' , 'x' , 'y' , 'z' ,
	'A' , 'B' , 'C' , 'D' , 'E' , 'F' , 'G' , 'H' , 'I' , 'J' , 'K' , 'L' , 'M' ,
	'N' , 'O' , 'P' , 'Q' , 'R' , 'S' , 'T' , 'U' , 'V' , 'W' , 'X' , 'Y' , 'Z'
] ;

const NUMBER = [ '0' , '1' , '2' , '3' , '4' , '5' , '6' , '7' , '8' , '9' ] ;
const HEX = [ '0' , '1' , '2' , '3' , '4' , '5' , '6' , '7' , '8' , '9' , 'a' , 'b' , 'c' , 'd' , 'e' , 'f'  ] ;

const BASE64_URL = [
	'A' , 'B' , 'C' , 'D' , 'E' , 'F' , 'G' , 'H' , 'I' , 'J' , 'K' , 'L' , 'M' ,
	'N' , 'O' , 'P' , 'Q' , 'R' , 'S' , 'T' , 'U' , 'V' , 'W' , 'X' , 'Y' , 'Z' ,
	'a' , 'b' , 'c' , 'd' , 'e' , 'f' , 'g' , 'h' , 'i' , 'j' , 'k' , 'l' , 'm' ,
	'n' , 'o' , 'p' , 'q' , 'r' , 's' , 't' , 'u' , 'v' , 'w' , 'x' , 'y' , 'z' ,
	'0' , '1' , '2' , '3' , '4' , '5' , '6' , '7' , '8' , '9' ,
	'-' , '_'
] ;



// Create an identifier of provided length all chars are of the [a-zA-Z0-9] class
hash.randomString = ( allowedChars , length , useEntropy = false ) => {
	var i , id = '' ;

	for ( i = 0 ; i < length ; i ++ ) {
		id += allowedChars[ Math.floor( hash.random( useEntropy ) * allowedChars.length ) ] ;
	}

	return id ;
} ;



hash.randomNumberString = ( length , useEntropy = false ) => hash.randomString( NUMBER , length , useEntropy ) ;
hash.randomHexString = ( length , useEntropy = false ) => hash.randomString( HEX , length , useEntropy ) ;
hash.randomBase26String = ( length , useEntropy = false ) => hash.randomString( LOWCASE_ALPHA , length , useEntropy ) ;

// Create a string of provided length, all chars are of the [a-z0-9] class
hash.randomBase36String = ( length , useEntropy = false ) => hash.randomString( LOWCASE_ALPHANUM , length , useEntropy ) ;

// Create a string of provided length, all chars are of the [a-zA-Z0-9] class
hash.randomBase62 =	// DEPRECATED, ambigous with hash.randomBase64 which have length in bytes
hash.randomBase62String = ( length , useEntropy = false ) => hash.randomString( ALPHANUM , length , useEntropy ) ;

hash.randomBase64UrlString = ( length , useEntropy = false ) => hash.randomString( BASE64_URL , length , useEntropy ) ;



// Create an identifier of provided length, the first char is of the [a-zA-Z] class, following chars are of the [a-zA-Z0-9] class
hash.randomIdentifier = ( length , useEntropy = false ) => {
	var i , id ;

	// First char is an alpha char
	id = ALPHA[ Math.floor( hash.random( useEntropy ) * ALPHA.length ) ] ;

	// Others are alphanum chars
	for ( i = 1 ; i < length ; i ++ ) {
		id += ALPHANUM[ Math.floor( hash.random( useEntropy ) * ALPHANUM.length ) ] ;
	}

	return id ;
} ;



hash.randomBase64 = ( byteLength , useEntropy = false , url = false ) =>
	hash.base64Encode( ( useEntropy ? crypto.randomBytes : crypto.pseudoRandomBytes )( byteLength ) , { url: url , noPad: true } ) ;

hash.randomHex = ( byteLength , useEntropy = false ) =>
	( useEntropy ? crypto.randomBytes : crypto.pseudoRandomBytes )( byteLength ).toString( 'hex' ) ;

