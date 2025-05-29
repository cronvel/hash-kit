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



// Interoperability
const ALGO_ALIASES = {
	sha1: 'SHA-1' ,
	sha256: 'SHA-256' ,
	sha384: 'SHA-384' ,
	sha512: 'SHA-512'
} ;

// /!\ ASYNC /!\
// .digest() return an ArrayBuffer, and it's not manipulable, it should be casted into an Uint8Array first
var generateHash ;

if ( globalThis.window ) {
	generateHash = async ( algo , data ) => {
		algo = Object.hasOwn( ALGO_ALIASES , algo ) ? ALGO_ALIASES[ algo ] : algo ;
		if ( typeof data === 'string' ) {
			let encoder = new TextEncoder() 
			data = encoder.encode( data ) ;
		}

		return new Uint8Array( await window.crypto.subtle.digest( algo , data ) ) ;
	} ;
}
else {
	generateHash = async ( algo , data ) =>  {
		algo = Object.hasOwn( ALGO_ALIASES , algo ) ? ALGO_ALIASES[ algo ] : algo ;
		if ( typeof data === 'string' ) {
			let encoder = new TextEncoder() 
			data = encoder.encode( data ) ;
		}

		return new Uint8Array( await globalThis.crypto.subtle.digest( algo , data ) ) ;
	} ;
}


// Create the object and export
const hash = {} ;
export default hash ;
//module.exports = hash ;



hash._areEqualArray = ( array1 , array2 ) => {
	if ( array1.length !== array2.length ) { return false ; }

	for ( let i = 0 ; i < array1.length ; i ++ ) {
		if ( array1[ i ] !== array2[ i ] ) { return false ; }
	}

	return true ;
} ;



hash._arrayToString = ( array , encoding ) => {
	switch ( encoding ) {
		case 'buffer' :
			return array ;
		case 'hex' :
			return hash._arrayToHex( array ) ;
		case 'base64' :
			return hash._arrayToBase64( array ) ;
		case 'base64url' :
			return hash._arrayToBase64Url( array ) ;
		default :
			throw new Error( "Unknown encoding: '" + encoding + "'" ) ;
	}
} ;



hash._arrayToHex = array => {
	var str = '' ;

	for ( let i = 0 ; i < array.length ; i ++ ) {
		str += array[ i ].toString( 16 ).padStart( 2 , '0' ) ;
	}

	return str ;
} ;



hash._arrayToBase64 = ( array , charMap = BASE64 , padding = true ) => {
	var str = '' ,
		modulo = array.length % 3 ,
		iMax = array.length - modulo ;

	for ( let i = 0 ; i < iMax ; i += 3 ) {
		str += charMap[ array[ i ] >> 2 ] ;
		str += charMap[ ( ( array[ i ] & 3 ) << 4 ) + ( array[ i + 1 ] >> 4 ) ] ;
		str += charMap[ ( ( array[ i + 1 ] & 15 ) << 2 ) + ( array[ i + 2 ] >> 6 ) ] ;
		str += charMap[ array[ i + 2 ] & 63 ] ;
	}

	if ( modulo === 2 ) {
		str += charMap[ array[ iMax ] >> 2 ] ;
		str += charMap[ ( ( array[ iMax ] & 3 ) << 4 ) + ( array[ iMax + 1 ] >> 4 ) ] ;
		str += charMap[ ( ( array[ iMax + 1 ] & 15 ) << 2 ) ] ;
		if ( padding ) { str += '=' ; }
	}
	else if ( modulo === 1 ) {
		str += charMap[ array[ iMax ] >> 2 ] ;
		str += charMap[ ( ( array[ iMax ] & 3 ) << 4 ) ] ;
		if ( padding ) { str += '==' ; }
	}

	return str ;
} ;

hash._arrayToBase64url = hash._arrayToBase64Url = array => hash._arrayToBase64( array , BASE64_URL , false ) ;



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
const BASE64 = [ ... UPPERCASE_ALPHA , ... LOWCASE_ALPHA , ... NUMBER , '+' , '/' ] ;
const BASE64_URL = [ ... UPPERCASE_ALPHA , ... LOWCASE_ALPHA , ... NUMBER , '-' , '_' ] ;



const LEADING_BITS_MASKS = [] ;
for ( let i = 0 ; i <= 32 ; i ++ ) { LEADING_BITS_MASKS[ i ] = ~ ( ( 1 << ( 32 - i ) ) - 1 ) ; }

const CHALLENGE_DEFAULT_PARAMS = {
	zeroes: 20 ,
	encoding: 'hex' ,
	algo: 'sha256' ,
	joint: ':' ,
	strip: true
} ;



// Hashcash-like algo
// https://en.wikipedia.org/wiki/Hashcash
hash.computeChallengeHash = async ( challenge , params = CHALLENGE_DEFAULT_PARAMS ) => {
	var joint = params.joint ?? CHALLENGE_DEFAULT_PARAMS.joint ,
		encoding = params.encoding ?? CHALLENGE_DEFAULT_PARAMS.encoding ,
		algo = params.algo ?? CHALLENGE_DEFAULT_PARAMS.algo ,
		zeroes = + params.zeroes || CHALLENGE_DEFAULT_PARAMS.zeroes ,	// Number of leading zero bits to obtain
		strip = !! ( params.strip ?? CHALLENGE_DEFAULT_PARAMS.strip ) ;	// Strip leading zeroes

	if ( zeroes < 1 || zeroes > 32 ) { throw new Error( "hash.computeChallengeHash(): argument 'zeroes' should be a number between 1 and 32" ) ; }
	//console.log( "dbg:" , { joint , encoding , algo , zeroes } ) ;

	for ( let counterInt = 0 ; ; counterInt ++ ) {
		let counter = hash.numberToString( counterInt , BASE64_URL ) ;
		let challengeHash = await hash._computeOneChallengeHash( challenge + joint + counter , algo , zeroes , strip , encoding ) ;
		if ( challengeHash ) {
			return { challenge , counter , hash: challengeHash } ;
		}
		//console.log( "Not found:" , str , hashBuffer ) ;
	}
} ;



hash.verifyChallengeHash = async ( challenge , counter , challengeHash , params = CHALLENGE_DEFAULT_PARAMS ) => {
	var joint = params.joint ?? CHALLENGE_DEFAULT_PARAMS.joint ,
		encoding = params.encoding ?? CHALLENGE_DEFAULT_PARAMS.encoding ,
		algo = params.algo ?? CHALLENGE_DEFAULT_PARAMS.algo ,
		zeroes = + params.zeroes || CHALLENGE_DEFAULT_PARAMS.zeroes ,	// Number of leading zero bits to obtain
		strip = !! ( params.strip ?? CHALLENGE_DEFAULT_PARAMS.strip ) ;	// Strip leading zeroes

	if ( zeroes < 1 || zeroes > 32 ) { throw new Error( "hash.computeChallengeHash(): argument 'zeroes' should be a number between 1 and 32" ) ; }

	if ( challengeHash instanceof Uint8Array ) {
		return hash._areEqualArray( challengeHash , await hash._computeOneChallengeHash( challenge + joint + counter , algo , zeroes , strip , encoding ) ) ;
	}

	if ( typeof challengeHash === 'string' ) {
		return challengeHash === await hash._computeOneChallengeHash( challenge + joint + counter , algo , zeroes , strip , encoding ) ;
	}

	throw new Error( "hash.checkChallengeHash(): the 'hash' argument should be a Buffer or a string" ) ;
} ;



hash._computeOneChallengeHash = async ( str , algo , zeroes , strip , encoding ) => {
	let hashBuffer = await generateHash( algo , str ) ;

	// Read a UInt32, there is no facilities for that in the browser -_-'
	let head = hashBuffer[ 0 ] * 16777216 + hashBuffer[ 1 ] * 65536 + hashBuffer[ 2 ] * 256 + hashBuffer[ 3 ] ;

	if ( ! ( head & LEADING_BITS_MASKS[ zeroes ] ) ) {
		// Found !
		let challengeHash = hashBuffer ;
		if ( strip && zeroes >= 8 ) { challengeHash = challengeHash.subarray( Math.floor( zeroes / 8 ) ) ; }
		if ( encoding ) { challengeHash = hash._arrayToString( challengeHash , encoding ) ; }
		return challengeHash ;
	}

	return null ;
} ;

