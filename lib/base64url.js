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



var base64url = {} ;
module.exports = base64url ;



// Load modules
var uint8Kit = require( './uint8-kit.js' ) ;



var uint6ToChar = [
	'A' , 'B' , 'C' , 'D' , 'E' , 'F' , 'G' , 'H' , 'I' , 'J' , 'K' , 'L' , 'M' ,
	'N' , 'O' , 'P' , 'Q' , 'R' , 'S' , 'T' , 'U' , 'V' , 'W' , 'X' , 'Y' , 'Z' ,
	'a' , 'b' , 'c' , 'd' , 'e' , 'f' , 'g' , 'h' , 'i' , 'j' , 'k' , 'l' , 'm' ,
	'n' , 'o' , 'p' , 'q' , 'r' , 's' , 't' , 'u' , 'v' , 'w' , 'x' , 'y' , 'z' ,
	'0' , '1' , '2' , '3' , '4' , '5' , '6' , '7' , '8' , '9' ,
	'-' , '_'
] ;

var charToUint6 = new Uint8Array( 256 ) ;

( function() {
	for ( var i = 0 ; i < uint6ToChar.length ; i ++ )
	{
		charToUint6[ uint6ToChar[ i ].charCodeAt( 0 ) ] = i ;
	}
} )() ;



base64url.fromUint8 = function fromUint8( uint8 )
{
	var i , iMax , base64 = '' , extraBytes = uint8.length % 3 ;
	
	iMax = uint8.length - extraBytes ;
	
	for ( i = 0 ; i < iMax ; i += 3 )
	{
		base64 +=
			uint6ToChar[ ( uint8[ i ] >> 2 ) ] +
			uint6ToChar[ ( ( uint8[ i ] & 0x03 ) << 4 ) + ( uint8[ i + 1 ] >> 4 ) ] +
			uint6ToChar[ ( ( uint8[ i + 1 ] & 0x0f ) << 2 ) + ( uint8[ i + 2 ] >> 6 ) ] +
			uint6ToChar[ uint8[ i + 2 ] & 0x3f ] ;
	}
	
	switch( extraBytes )
	{
		case 1 :
			base64 +=
				uint6ToChar[ ( uint8[ i ] >> 2 ) ] +
				uint6ToChar[ ( ( uint8[ i ] & 0x03 ) << 4 ) ] ;
			break ;
		
		case 2 :
			base64 +=
				uint6ToChar[ ( uint8[ i ] >> 2 ) ] +
				uint6ToChar[ ( ( uint8[ i ] & 0x03 ) << 4 ) + ( uint8[ i + 1 ] >> 4 ) ] +
				uint6ToChar[ ( ( uint8[ i + 1 ] & 0x0f ) << 2 ) ] ;
			break ;
	}
	
	return base64 ;
} ;



base64url.toUint8 = function toUint8( base64 )
{
	var i , j , iMax , uint8 , extraChars = base64.length % 4 ,
		a , b , c , d ;
	
	// Should be 0, 2 or 3
	if ( extraChars === 1 ) { throw new Error( "Bad base64-url length" ) ; }
	
	iMax = base64.length - extraChars ;
	uint8 = new Uint8Array( Math.floor( base64.length * 3 / 4 ) ) ;
	
	//console.log( "extraChars:" , extraChars ) ;
	//console.log( "iMax:" , iMax ) ;
	
	for ( i = 0 , j = 0 ; i < iMax ; i += 4 , j += 3 )
	{
		a = charToUint6[ base64.charCodeAt( i ) ] ;
		//console.log( "### a:" , base64[ i ] , base64.charCodeAt( i ) , a ) ;
		b = charToUint6[ base64.charCodeAt( i + 1 ) ] ;
		//console.log( "### b:" , base64[ i + 1 ] , base64.charCodeAt( i + 1 ) , b ) ;
		c = charToUint6[ base64.charCodeAt( i + 2 ) ] ;
		//console.log( "### c:" , base64[ i + 2 ] , base64.charCodeAt( i + 2 ) , c ) ;
		d = charToUint6[ base64.charCodeAt( i + 3 ) ] ;
		//console.log( "### d:" , base64[ i + 3 ] , base64.charCodeAt( i + 3 ) , d ) ;
		
		uint8[ j ] = ( a << 2 ) + ( b >> 4 ) ;
		uint8[ j + 1 ] = ( b << 4 ) + ( c >> 2 ) ;
		uint8[ j + 2 ] = ( c << 6 ) + d ;
	}
	
	switch( extraChars )
	{
		case 2 :
			a = charToUint6[ base64.charCodeAt( i ) ] ;
			b = charToUint6[ base64.charCodeAt( i + 1 ) ] ;
			
			uint8[ j ] = ( a << 2 ) + ( b >> 4 ) ;
			break ;
		
		case 3 :
			a = charToUint6[ base64.charCodeAt( i ) ] ;
			b = charToUint6[ base64.charCodeAt( i + 1 ) ] ;
			c = charToUint6[ base64.charCodeAt( i + 2 ) ] ;
			
			uint8[ j ] = ( a << 2 ) + ( b >> 4 ) ;
			uint8[ j + 1 ] = ( b << 4 ) + ( c >> 2 ) ;
			break ;
	}
	
	return uint8 ;
} ;



base64url.fromAscii = function fromAscii( str )
{
	return base64url.fromUint8( uint8Kit.fromAscii( str ) ) ;
} ;



base64url.toAscii = function fromAscii( base64 )
{
	return uint8Kit.toAscii( base64url.toUint8( base64 ) ) ;
} ;



