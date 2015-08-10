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



var uint8Kit = {} ;
module.exports = uint8Kit ;



uint8Kit.toAscii = function toAscii( uint8 )
{
	return String.fromCharCode.apply( undefined , uint8 ) ;
} ;



uint8Kit.fromAscii = function fromAscii( str )
{
	var i , iMax = str.length , uint8 = new Uint8Array( iMax ) ;
	
	for ( i = 0 ; i < iMax ; i ++ )
	{
		uint8[ i ] = str.charCodeAt( i ) ;
	}
	
	return uint8 ;
} ;



// Big Endian
uint8Kit.readUInt = function readUInt( uint8 , offset , byteLength )
{
	var value = uint8[ offset + --byteLength ] ;
	var mul = 1 ;
	
	while ( byteLength > 0 && ( mul *= 0x100 ) )
	{
		value += uint8[ offset + --byteLength ] * mul ;
	}
	
	return value ;
} ;



// Big Endian
uint8Kit.writeUInt = function writeUInt( uint8 , value , offset , byteLength )
{
	var i = byteLength - 1 ;
	var mul = 1 ;
	
	uint8[ offset + i ] = value ;
	
	while ( -- i >= 0 && ( mul *= 0x100 ) )
	{
		uint8[ offset + i ] = ( value / mul ) >>> 0 ;
	}
	
	return offset + byteLength ;
} ;



// Big Endian
uint8Kit.readInt = function readInt( uint8 , offset , byteLength )
{
	var i = byteLength ;
	var mul = 1 ;
	var value = uint8[ offset + --i ] ;
	
	while ( i > 0 && ( mul *= 0x100 ) )
	{
		value += uint8[ offset + --i ] * mul ;
	}
	
	mul *= 0x80 ;
	
	if ( value >= mul )
	{
		value -= Math.pow( 2 , 8 * byteLength ) ;
	}
	
	return value ;
} ;



// Big Endian
uint8Kit.writeInt = function writeInt( uint8 , value , offset , byteLength )
{
	var i = byteLength - 1 ;
	var mul = 1 ;
	var sub = value < 0 ? 1 : 0 ;
	
	uint8[ offset + i ] = value ;
	
	while ( --i >= 0 && ( mul *= 0x100 ) )
	{
		uint8[ offset + i ] = ( ( value / mul ) >> 0 ) - sub ;
	}
	
	return offset + byteLength ;
} ;




