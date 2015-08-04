/*
	The Cedric's Swiss Knife (CSK) - CSK hash toolbox

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
	var buffer ;
	
	if ( ! options || typeof options !== 'object' ) { options = {} ; }
	
	// If necessary, convert to Buffer
	if ( input instanceof Buffer )
	{
		buffer = input ;
	}
	else
	{
		if ( typeof input === 'string' ) { buffer = new Buffer( input ) ; }
		else if ( typeof input === 'number' ) { buffer = new Buffer( 6 ) ; buffer.writeUIntBE( input , 0 , 6 ) ; }
		else { throw new TypeError( '[hash-kit] .base64Encode() expect argument #0 to be a Buffer, a string or a number' ) ; }
	}
	
	// Convert buffer to base64
	var output = buffer.toString( 'base64' ) ;
	
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
	
	if ( options.to )
	{
		switch ( options.to )
		{
			case 'integer' :
				output = output.readUIntBE( 0 , 6 ) ;
				break ;
			default :
				output = output.toString( options.to ) ;
		}
	}
	
	return output ;
} ;



hash.fingerprint = function fingerprint( data )
{
	// Note SHA1 is as fast as MD5 nowadays
	
	if ( typeof data === 'string' )
	{
		return hash.base64Encode( crypto.createHash( 'sha1' ).update( data ).digest() , { url: true } ) ;
	}
	
	if ( typeof data === 'number' )
	{
		var buffer = new Buffer( 8 ) ;
		buffer.writeDoubleLE( data , 0 ) ;
		return hash.base64Encode( buffer , { url: true } ) ;
	}
	
	if ( data && typeof data === 'object' )
	{
		return hash.base64Encode( crypto.createHash( 'sha1' ).update( JSON.stringify( data ) ).digest() , { url: true } ) ;
	}
	
	return undefined ;
} ;



// Do not except ultimate uniqness, also it is valid for most non-database use-cases
hash.tinyId = function tinyId()
{
	return hash.base64Encode( crypto.pseudoRandomBytes( 6 ) , { url: true } ) ;
} ;



// Generate a random unique id
hash.uniqueId = hash.uniqId = function uniqId()
{
	return hash.fingerprint( '' + Date.now() + crypto.pseudoRandomBytes( 4 ).readUInt32LE( 0 , true ) ) ;
} ;



// Generate a password hash
hash.password = function password( pw , salt , algo )
{
	if ( typeof pw !== 'string' ) { throw new TypeError( '[hash] .password(): arguments #0 should be a string' ) ; }
	if ( typeof salt !== 'string' ) { salt = '' ; }
	if ( typeof algo !== 'string' ) { algo = 'sha512' ; }
	
	return crypto.createHash( algo ).update( salt + pw ).digest().toString( 'base64' ) ;
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





			/* Token Generator */



var MAX_UINT32 = Math.pow( 2 , 32 ) - 1 ;
var MAX_UINT16 = Math.pow( 2 , 16 ) - 1 ;
var tokenAutoIncrement16 = Math.floor( Math.random() * MAX_UINT16 ) ;
var tokenAutoIncrement32 = Math.floor( Math.random() * MAX_UINT32 ) ;

//console.log( tokenAutoIncrement16 , tokenAutoIncrement32 ) ;



// Generate a random token
hash.createTokenGenerator = function createTokenGenerator( structure )
{
	var i , element ;
	
	var generator = {
		structure: structure ,
		byteLength: 0
	} ;
	
	if ( ! Array.isArray( structure ) )
	{
		throw new TypeError( '[hash-kit] .createTokenGenerator(), argument #0: bad token structure, it should be an Array of Object' ) ;
	}
	
	for ( i = 0 ; i < structure.length ; i ++ )
	{
		element = structure[ i ] ;
		
		if ( ! element || typeof element !== 'object' )
		{
			throw new TypeError( '[hash-kit] .createTokenGenerator(), argument#0: bad token structure, it should be an Array of Object' ) ;
		}
		
		switch ( element.type )
		{
			case 'random' :
				element.genType = 'buffer' ;
				element.decodeType = 'base64' ;
				element.auto = element.type ;
				break ;
			case 'timestamp' :
				element.genType = element.decodeType = 'int' ;
				element.length = 6 ;
				element.auto = element.type ;
				break ;
			case 'increment16' :
				element.genType = element.decodeType = 'uint' ;
				element.length = 2 ;
				element.auto = element.type ;
				break ;
			case 'increment32' :
				element.genType = element.decodeType = 'uint' ;
				element.length = 4 ;
				element.auto = element.type ;
				break ;
			default :
				element.genType = element.decodeType = element.type ;
				element.auto = null ;
		}
		
		if ( typeof element.length !== 'number' || element.length !== Math.floor( element.length ) || element.length < 1 )
		{
			throw new TypeError( "[hash-kit] .createTokenGenerator(), argument#0: bad token structure, it should be an Array of Object, having a 'length' property (positive integer)" ) ;
		}
		
		switch ( element.genType )
		{
			case 'int' :
			case 'uint' :
				if ( element.length > 6 )
				{
					throw new TypeError( "[hash-kit] .createTokenGenerator(), 'length' property is too big (max 6 bytes for integer)" ) ;
				}
				break ;
			case 'BASE36' :
			case 'string' :
			case 'buffer' :
				break ;
			default :
				throw new TypeError( "[hash-kit] .createTokenGenerator(), unknown type: " + element.genType ) ;
		}
		
		generator.byteLength += element.length ;
	}
	
	generator.tokenLength = 4 * Math.ceil( generator.byteLength / 3 ) ;	// Base64: 33% of overhead + padding
	//console.log( "byteLength:" , generator.byteLength , " tokenLength:" , generator.tokenLength ) ;
	generator.buffer = new Buffer( generator.byteLength ) ;
	generator.create = createToken.bind( generator ) ;
	generator.extract = extractFromToken.bind( generator ) ;
	
	return generator ;
} ;
	
	

function createToken( data )
{
	var i , iMax , element , pos = 0 , byteLength ;
	
	if ( ! data || typeof data !== 'object' )
	{
		//data = {} ;
		throw new TypeError( '[hash-kit] .createToken(), argument #0: bad token data, it should be an Object' ) ;
	}
	
	iMax = this.structure.length ;
	
	for ( i = 0 ; i < iMax ; i ++ )
	{
		element = this.structure[ i ] ;
		
		if ( element.auto )
		{
			switch ( element.auto )
			{
				case 'random' :
					data[ element.key ] = crypto.pseudoRandomBytes( element.length ) ;
					break ;
				case 'timestamp' :
					data[ element.key ] = Date.now() ;
					break ;
				case 'increment16' :
					data[ element.key ] = tokenAutoIncrement16 ;
					tokenAutoIncrement16 ++ ;
					if ( tokenAutoIncrement16 > MAX_UINT16 ) { tokenAutoIncrement16 = 0 ; }
					break ;
				case 'increment32' :
					data[ element.key ] = tokenAutoIncrement32 ;
					tokenAutoIncrement32 ++ ;
					if ( tokenAutoIncrement32 > MAX_UINT32 ) { tokenAutoIncrement32 = 0 ; }
					break ;
			}
		}
		
		switch ( element.genType )
		{
			case 'int' :
				this.buffer.writeIntBE( data[ element.key ] , pos , element.length ) ;
				break ;
			case 'uint' :
				this.buffer.writeUIntBE( data[ element.key ] , pos , element.length ) ;
				break ;
			case 'BASE36' :
				this.buffer.writeUIntBE( parseInt( data[ element.key ] , 36 ) , pos , element.length ) ;
				break ;
			case 'string' :
				byteLength = Buffer.byteLength( data[ element.key ] ) ;
				
				// Pad the string to the right with NUL if necessary
				while ( byteLength < element.length )
				{
					data[ element.key ] += '\x00' ;
					byteLength ++ ;
				}
				
				this.buffer.write( data[ element.key ] , pos , element.length ) ;
				break ;
			case 'buffer' :
				data[ element.key ].copy( this.buffer , pos ) ;
				// Get the data clean for the user?
				if ( element.decodeType === 'base64' ) { data[ element.key ] = data[ element.key ].toString( 'base64' ) ; }
				break ;
		}
		
		pos += element.length ;
	}
	
	return this.buffer.toString( 'base64' ) ;
}



function extractFromToken( token )
{
	var i , iMax , element , pos = 0 , data = {} , indexOf ;
	
	if ( typeof token !== 'string' )
	{
		throw new TypeError( '[hash-kit] .extractFromToken(): argument #0 should be a string' ) ;
	}
	
	if ( token.length !== this.tokenLength )
	{
		throw new Error( '[hash-kit] .createToken(): argument #0 does not match the token length (expected: ' + this.tokenLength + ', actual: ' + token.length + ')' ) ;
	}
	
	iMax = this.structure.length ;
	
	this.buffer.write( token , 0 , token.length , 'base64' ) ;
	
	for ( i = 0 ; i < iMax ; i ++ )
	{
		element = this.structure[ i ] ;
		
		switch ( element.decodeType )
		{
			case 'int' :
				data[ element.key ] = this.buffer.readIntBE( pos , element.length ) ;
				break ;
			case 'uint' :
				data[ element.key ] = this.buffer.readUIntBE( pos , element.length ) ;
				break ;
			case 'BASE36' :
				data[ element.key ] = this.buffer.readUIntBE( pos , element.length ).toString( 36 ).toUpperCase() ;
				break ;
			case 'string' :
				data[ element.key ] = this.buffer.toString( 'utf8' , pos , element.length ) ;
				indexOf = data[ element.key ].indexOf( '\x00' ) ;
				if ( indexOf !== -1 ) { data[ element.key ] = data[ element.key ].slice( 0 , indexOf ) ; }
				break ;
			case 'base64' :
				data[ element.key ] = this.buffer.toString( 'base64' , pos , pos + element.length ) ;
				break ;
		}
		
		pos += element.length ;
	}
	
	return data ;
}


