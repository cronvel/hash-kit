/*
	Hash Kit

	Copyright (c) 2014 - 2025 Cédric Ronvel

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
const generateHash = crypto.hash ? ( algo , data ) => crypto.hash( algo, data , 'buffer' ) :
	( algo , data ) => crypto.createHash( algo ).update( data ).digest() ;

/*
	Run:
	json-kit-builder stringify external/json-kit-ordered-keys-stringify.js --orderedKeys
*/
const serialize = require( '../external/json-kit-ordered-keys-stringify.js' ) ;

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
	var buffer ,
		url = false ,
		noPad = false ;

	if ( options === true ) {
		url = true ;
	}
	else if ( options && typeof options === 'object' ) {
		url = !! options.url ;
		noPad = !! options.noPad ;
	}

	// If necessary, convert to Buffer
	if ( input instanceof Buffer ) { buffer = input ; }
	else if ( typeof input === 'string' ) { buffer = Buffer.from( input ) ; }
	else if ( typeof input === 'number' ) { buffer = Buffer.allocUnsafe( 6 ) ; buffer.writeUIntBE( input , 0 , 6 ) ; }
	else { throw new TypeError( '[hash-kit] .base64Encode() expect argument #0 to be a Buffer, a string or a number' ) ; }

	var output ;

	// If url option is on, then convert to base64 URL
	if ( url ) {
		// Convert buffer to base64url, padding is always omitted here
		output = buffer.toString( 'base64url' ) ;
	}
	else {
		// Convert buffer to base64
		output = buffer.toString( 'base64' ) ;

		if ( noPad ) {
			output = output.replace( /[=]{1,2}$/g , '' ) ;
		}
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



// Not collision resistant, not for user input
// Note: SHA1 is as fast as MD5 nowadays
hash.fingerprint = ( data , algo = 'sha1' ) => {
	if ( typeof data === 'string' ) {
		return hash.base64Encode( generateHash( algo , data ) , true ) ;
	}

	if ( typeof data === 'number' ) {
		var buffer = Buffer.allocUnsafe( 8 ) ;
		buffer.writeDoubleLE( data , 0 ) ;
		return hash.base64Encode( buffer , { url: true } ) ;
	}

	if ( data && typeof data === 'object' ) {
		return hash.base64Encode( generateHash( algo , serialize( data ) ) , true ) ;
	}

	return undefined ;
} ;



// 50% faster than fingerprint, suitable for dictionary keys
// Note: SHA1 is as fast as MD5 nowadays
hash.hashKey = str => generateHash( 'sha1' , str ).toString( 'base64' ) ;

// Do not expect ultimate uniqueness, also it is valid for most non-database use-cases
hash.tinyId = () => hash.base64Encode( crypto.pseudoRandomBytes( 6 ) , true ) ;

// Generate a random unique id
hash.uniqueId = hash.uniqId = () => hash.fingerprint( '' + Date.now() + crypto.pseudoRandomBytes( 4 ).readUInt32LE( 0 , true ) ) ;


// Generate a password hash
hash.password = ( pw , salt , algo ) => {
	if ( typeof pw !== 'string' ) { throw new TypeError( '[hash] .password(): arguments #0 should be a string' ) ; }
	if ( typeof salt !== 'string' ) { salt = '' ; }
	if ( typeof algo !== 'string' ) { algo = 'sha512' ; }

	return generateHash( algo , salt + pw ).toString( 'base64' ) ;
} ;



// Replacement of Math.random() using crypto
hash.random = useEntropy => ( useEntropy ? crypto.randomBytes : crypto.pseudoRandomBytes )( 4 ).readUInt32LE( 0 , true ) / UINT32_COUNT ;



const LOWCASE_ALPHA = [
	'a' , 'b' , 'c' , 'd' , 'e' , 'f' , 'g' , 'h' , 'i' , 'j' , 'k' , 'l' , 'm' ,
	'n' , 'o' , 'p' , 'q' , 'r' , 's' , 't' , 'u' , 'v' , 'w' , 'x' , 'y' , 'z'
] ;
const UPPERCASE_ALPHA = [
	'A' , 'B' , 'C' , 'D' , 'E' , 'F' , 'G' , 'H' , 'I' , 'J' , 'K' , 'L' , 'M' ,
	'N' , 'O' , 'P' , 'Q' , 'R' , 'S' , 'T' , 'U' , 'V' , 'W' , 'X' , 'Y' , 'Z'
] ;
const NUMBER = [ '0' , '1' , '2' , '3' , '4' , '5' , '6' , '7' , '8' , '9' ] ;
const ALPHA = [ ... LOWCASE_ALPHA , ... UPPERCASE_ALPHA ] ;
const LOWCASE_ALPHANUM = [ ... NUMBER , ... LOWCASE_ALPHA ] ;
const ALPHANUM = [ ... NUMBER , ... LOWCASE_ALPHA , ... UPPERCASE_ALPHA ] ;
const HEX = [ ... NUMBER , 'a' , 'b' , 'c' , 'd' , 'e' , 'f'  ] ;
const BASE64_URL = [ ... UPPERCASE_ALPHA , ... LOWCASE_ALPHA , ... NUMBER , '-' , '_' ] ;



// Create an identifier of provided length all chars are of the [a-zA-Z0-9] class
hash.randomString = ( allowedChars , length , useEntropy = false ) => {
	var id = '' ;

	for ( let i = 0 ; i < length ; i ++ ) {
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
	// First char is an alpha char
	var id = ALPHA[ Math.floor( hash.random( useEntropy ) * ALPHA.length ) ] ;

	// Others are alphanum chars
	for ( let i = 1 ; i < length ; i ++ ) {
		id += ALPHANUM[ Math.floor( hash.random( useEntropy ) * ALPHANUM.length ) ] ;
	}

	return id ;
} ;



hash.randomBase64 = ( byteLength , useEntropy = false , url = false ) =>
	hash.base64Encode( ( useEntropy ? crypto.randomBytes : crypto.pseudoRandomBytes )( byteLength ) , { url: url , noPad: true } ) ;

hash.randomHex = ( byteLength , useEntropy = false ) =>
	( useEntropy ? crypto.randomBytes : crypto.pseudoRandomBytes )( byteLength ).toString( 'hex' ) ;




hash.numberToString = ( number , charMap = BASE64_URL ) => {
	number = Math.round( + number || 0 ) ;
	if ( number < 0 ) { throw new Error( "hash.numberToString() only support positive integers and zero." ) ; }
	if ( number === 0 ) { return charMap[ 0 ] ; }

	var str = '' ;

	while ( number ) {
		let modulo = number % charMap.length ;
		str = charMap[ modulo ] + str ;
		number = ( number - modulo ) / charMap.length ;
	}

	return str ;
} ;



const CHALLENGE_DEFAULT_PARAMS = {
	zeroes: 20 ,
	encoding: 'hex' ,
	algo: 'sha256' ,
	joint: ':' ,
	strip: true
} ;



// Hashcash-like algo
// https://en.wikipedia.org/wiki/Hashcash
hash.computeChallengeHash = ( challenge , params = CHALLENGE_DEFAULT_PARAMS ) => {
	var joint = params.joint ?? CHALLENGE_DEFAULT_PARAMS.joint ,
		encoding = params.encoding ?? CHALLENGE_DEFAULT_PARAMS.encoding ,
		algo = params.algo ?? CHALLENGE_DEFAULT_PARAMS.algo ,
		zeroes = + params.zeroes || CHALLENGE_DEFAULT_PARAMS.zeroes ,	// Number of leading zero bits to obtain
		strip = !! ( params.strip ?? CHALLENGE_DEFAULT_PARAMS.strip ) ;	// Strip leading zeroes

	if ( zeroes < 1 || zeroes > 32 ) { throw new Error( "hash.computeChallengeHash(): argument 'zeroes' should be a number between 1 and 32" ) ; }
	var zeroesMask = ~ ( ( 1 << ( 32 - zeroes ) ) - 1 ) ;
	//console.log( "dbg:" , { joint , encoding , algo , zeroes , zeroesMask } ) ;
	
	for ( let counter = 0 ;; counter ++ ) {
		let counterStr = hash.numberToString( counter , BASE64_URL ) ;
		let str = challenge + joint + counterStr ;
		let hashBuffer = generateHash( algo , str ) ;
		let head = hashBuffer.readUInt32BE( 0 ) ;

		if ( ! ( head & zeroesMask ) ) {
			// Found !
			let hash = hashBuffer ;
			if ( strip && zeroes >= 8 ) { hash = hash.slice( Math.floor( zeroes / 8 ) ) ; }
			if ( encoding ) { hash = hash.toString( encoding ) ; }
			return { challenge , counter: counterStr , hash } ;
		}

		//console.log( "Not found:" , str , hashBuffer ) ;
	}
} ;



hash.checkChallengeHash = ( challenge , counter , hash , params = CHALLENGE_DEFAULT_PARAMS ) => {
	var joint = params.joint ?? CHALLENGE_DEFAULT_PARAMS.joint ,
		encoding = params.encoding ?? CHALLENGE_DEFAULT_PARAMS.encoding ,
		algo = params.algo ?? CHALLENGE_DEFAULT_PARAMS.algo ,
		zeroes = + params.zeroes || CHALLENGE_DEFAULT_PARAMS.zeroes ,	// Number of leading zero bits to obtain
		strip = !! ( params.strip ?? CHALLENGE_DEFAULT_PARAMS.strip ) ;	// Strip leading zeroes

	if ( zeroes < 1 || zeroes > 32 ) { throw new Error( "hash.computeChallengeHash(): argument 'zeroes' should be a number between 1 and 32" ) ; }
	var zeroesMask = ~ ( ( 1 << ( 32 - zeroes ) ) - 1 ) ;

	var hashBuffer ;

	if ( typeof hash === 'string' ) {
		hashBuffer = Buffer.from( hash , encoding ) ;
	}
	else if ( Buffer.isBuffer( hash ) ) {
		hashBuffer = hash ;
	}
	else {
		throw new Error( "hash.checkChallengeHash(): the 'hash' argument should be a Buffer or a string" ) ;
	}

	// First check that the provided hash have enough zeroes...
	let head = hashBuffer.readUInt32BE( 0 ) ;
	if ( head & zeroesMask ) { return false ; }

	// Now check that the challenge and the counter produce the provided hash
	let str = challenge + joint + counter ;
	let ourHashBuffer = generateHash( algo , str ) ;
	if ( Buffer.compare( ourHashBuffer , hashBuffer ) ) { return false ; }

	return true ;
} ;

