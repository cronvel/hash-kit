/*
	The Cedric's Swiss Knife (CSK) - CSK math toolbox

	Copyright (c) 2015 Cédric Ronvel 
	
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



// Modules
var crypto = require( 'crypto' ) ;


// Create the object
var hash = {} ;

// Export it!
module.exports = hash ;



hash.base64Encode = function base64Encode( input , options )
{
	if ( ! options || typeof options !== 'object' ) { options = {} ; }
	
	// If necessary, convert to Buffer
	if ( ! ( input instanceof Buffer ) ) { input = new Buffer( input || '' ) ; }
	
	// Convert buffer to base64
	var output = input.toString( 'base64' ) ;
	
	// If url option is on, then convert to base64 URL
	if ( options.url ) { output = output.replace( /\+/g , '-' ).replace( /\//g , '_' ).replace( /[=]{1,2}$/g , '' ) ; }
	
	return output ;
} ;



hash.base64Decode = function base64Decode( input , options )
{
	if ( ! options || typeof options !== 'object' ) { options = {} ; }
	
	if ( typeof input !== 'string' ) { input = '' ; }
	
	var output ;
	
	// If url option is on, then convert base64 URL to regular base64
	if ( options.url )
	{
		var missing = 4 - input.length % 4 ;
		
		switch ( missing )
		{
			case 1 : input = input + '=' ; break ;
			case 2 : input = input + '==' ; break ;
			case 3 : throw new Error( "[hash] base64Decode(): not a valid base64 URL" ) ;
		}
	}
	
	// Create a buffer with the input
	output = new Buffer( input , 'base64' ) ;
	
	if ( options.to ) { output = output.toString( options.to ) ; }
	
	return output ;
} ;



hash.fingerprint = function fingerprint( data )
{
	if ( typeof data === 'string' )
	{
		return hash.base64Encode( crypto.createHash( 'md5' ).update( data ).digest() , { url: true } ) ;
	}
	
	if ( typeof data === 'number' )
	{
		var buffer = new Buffer( 8 ) ;
		buffer.writeDoubleLE( data , 0 ) ;
		return hash.base64Encode( buffer , { url: true } ) ;
	}
	
	if ( data && typeof data === 'object' )
	{
		return hash.base64Encode( crypto.createHash( 'md5' ).update( JSON.stringify( data ) ).digest() , { url: true } ) ;
	}
	
	return undefined ;
} ;



// Do not except ultimate uniqness, also it is valid for most non-database use-cases
hash.tinyId = function tinyId()
{
	return hash.base64Encode( crypto.pseudoRandomBytes( 6 ) , { url: true } ) ;
} ;



// Generate a random uniq id
hash.uniqId = function uniqId()
{
	return hash.fingerprint( '' + Date.now() + crypto.pseudoRandomBytes( 4 ).readUInt32LE( 0 , true ) ) ;
} ;



var alpha = [
	'a' , 'b' , 'c' , 'd' , 'e' , 'f' , 'g' , 'h' , 'i' , 'j' , 'k' , 'l' , 'm' ,
	'n' , 'o' , 'p' , 'q' , 'r' , 's' , 't' , 'u' , 'v' , 'w' , 'x' , 'y' , 'z' ,
	'A' , 'B' , 'C' , 'D' , 'E' , 'F' , 'G' , 'H' , 'I' , 'J' , 'K' , 'L' , 'M' ,
	'N' , 'O' , 'P' , 'Q' , 'R' , 'S' , 'T' , 'U' , 'V' , 'W' , 'X' , 'Y' , 'Z'
] ;



var alphanum = [
	'a' , 'b' , 'c' , 'd' , 'e' , 'f' , 'g' , 'h' , 'i' , 'j' , 'k' , 'l' , 'm' ,
	'n' , 'o' , 'p' , 'q' , 'r' , 's' , 't' , 'u' , 'v' , 'w' , 'x' , 'y' , 'z' ,
	'A' , 'B' , 'C' , 'D' , 'E' , 'F' , 'G' , 'H' , 'I' , 'J' , 'K' , 'L' , 'M' ,
	'N' , 'O' , 'P' , 'Q' , 'R' , 'S' , 'T' , 'U' , 'V' , 'W' , 'X' , 'Y' , 'Z' ,
	'0' , '1' , '2' , '3' , '4' , '5' , '6' , '7' , '8' , '9'
] ;



// Create an identifier of provided length, the first char is of [a-zA-Z] class, following char are of [a-zA-Z0-9] class
hash.randomIdentifier = function randomIdentifier( length )
{
	var i , id ;
	
	// First char is an alpha char
	id = alpha[ Math.floor( Math.random() * alpha.length ) ] ;
	
	// Others are alphanum chars
	for ( i = 1 ; i < length ; i ++ )
	{
		id += alphanum[ Math.floor( Math.random() * alphanum.length ) ] ;
	}
	
	return id ;
} ;


