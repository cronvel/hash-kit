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



// Partial polyfill: contains only needed things

if ( ! Uint8Array ) { Uint8Array = Array ; }

// Seriously, Chrome... 
if ( ! Uint8Array.prototype.slice ) { Uint8Array.prototype.slice = Array.prototype.slice ; }

if ( ! Uint16Array ) { Uint16Array = Array ; }

/*
if ( ! Uint32Array ) { Uint32Array = Array ; }
if ( ! Uint32Array.prototype.slice ) { Uint32Array.prototype.slice = Array.prototype.slice ; }
*/



			/* Numbers */



// Unsigned

uint8Kit.readUInt8 = function readUInt8( uint8 , offset )
{
	return uint8[ offset ] ;
} ;



uint8Kit.writeUInt8 = function writeUInt8( uint8 , value , offset )
{
	uint8[ offset ] = value & 255 ;
} ;



uint8Kit.readUInt16BE = uint8Kit.readUInt16 = function readUInt16( uint8 , offset )
{
	return ( uint8[ offset ] << 8 ) | ( uint8[ offset + 1 ] ) ;
} ;



uint8Kit.writeUInt16BE = uint8Kit.writeUInt16 = function writeUInt16( uint8 , value , offset )
{
	uint8[ offset ] = ( value >>> 8 ) & 255 ;
	uint8[ offset + 1 ] = value & 255 ;
} ;



uint8Kit.readUInt32BE = uint8Kit.readUInt32 = function readUInt32( uint8 , offset )
{
	return ( uint8[ offset ] * 0x1000000 ) |	// do not use << 24 here
		( uint8[ offset + 1 ] << 16 ) |
		( uint8[ offset + 2 ] << 8 ) |
		( uint8[ offset + 3 ] ) ;
} ;



uint8Kit.writeUInt32BE = uint8Kit.writeUInt32 = function writeUInt32( uint8 , value , offset )
{
	uint8[ offset ] = ( value >>> 24 ) & 255 ;
	uint8[ offset + 1 ] = ( value >>> 16 ) & 255 ;
	uint8[ offset + 2 ] = ( value >>> 8 ) & 255 ;
	uint8[ offset + 3 ] = value & 255 ;
} ;



uint8Kit.readUIntBE = uint8Kit.readUInt = function readUInt( uint8 , offset , byteLength )
{
	var value = uint8[ offset + --byteLength ] ;
	var mul = 1 ;
	
	while ( byteLength > 0 && ( mul *= 0x100 ) )
	{
		value += uint8[ offset + --byteLength ] * mul ;
	}
	
	return value ;
} ;



uint8Kit.writeUIntBE = uint8Kit.writeUInt = function writeUInt( uint8 , value , offset , byteLength )
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



// Signed integer

uint8Kit.readInt8 = function readInt8( uint8 , offset )
{
	var value = uint8[ offset ] ;
	return ( value & 0x80 ) ? value | 0xffffff00 : value ;
} ;



uint8Kit.writeInt8 = function writeInt8( uint8 , value , offset )
{
	uint8[ offset ] = value & 255 ;
} ;



uint8Kit.readInt16BE = uint8Kit.readInt16 = function readInt16( uint8 , offset )
{
	var value = ( uint8[ offset ] << 8 ) | ( uint8[ offset + 1 ] ) ;
	return ( value & 0x8000 ) ? value | 0xffff0000 : value ;
} ;



uint8Kit.writeInt16BE = uint8Kit.writeInt16 = function writeInt16( uint8 , value , offset )
{
	uint8[ offset ] = ( value >>> 8 ) & 255 ;
	uint8[ offset + 1 ] = value & 255 ;
} ;



uint8Kit.readInt32BE = uint8Kit.readInt32 = function readInt32( uint8 , offset )
{
	return ( uint8[ offset ] << 24 ) |
		( uint8[ offset + 1 ] << 16 ) |
		( uint8[ offset + 2 ] << 8 ) |
		( uint8[ offset + 3 ] ) ;
} ;



uint8Kit.writeInt32BE = uint8Kit.writeInt32 = function writeInt32( uint8 , value , offset )
{
	uint8[ offset ] = ( value >>> 24 ) & 255 ;
	uint8[ offset + 1 ] = ( value >>> 16 ) & 255 ;
	uint8[ offset + 2 ] = ( value >>> 8 ) & 255 ;
	uint8[ offset + 3 ] = value & 255 ;
} ;



uint8Kit.readIntBE = uint8Kit.readInt = function readInt( uint8 , offset , byteLength )
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



uint8Kit.writeIntBE = uint8Kit.writeInt = function writeInt( uint8 , value , offset , byteLength )
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



			/* ASCII */



uint8Kit.toAscii = function toAscii( uint8 )
{
	return String.fromCharCode.apply( undefined , uint8 ) ;
} ;



uint8Kit.fromAscii = function fromAscii( str )
{
	var i , iMax = str.length , uint8 = new Uint8Array( iMax ) ;
	
	for ( i = 0 ; i < iMax ; i ++ )
	{
		uint8[ i ] = str.charCodeAt( i ) & 255 ;
	}
	
	return uint8 ;
} ;



uint8Kit.readAscii = function readAscii( uint8 , offset , byteLength )
{
	return String.fromCharCode.apply( undefined , uint8.slice( offset , byteLength === undefined ? uint8.length : offset + byteLength ) ) ;
} ;



uint8Kit.writeAscii = function writeAscii( uint8 , str , offset , byteLength )
{
	var i , iMax ;
	
	if ( byteLength === undefined ) { byteLength = str.length ; }
	
	iMax = Math.min( str.length , byteLength , uint8.length - offset ) ;
	
	for ( i = 0 ; i < iMax ; i ++ )
	{
		uint8[ offset + i ] = str.charCodeAt( i ) & 255 ;
	}
} ;


			/* UTF 16 */


uint8Kit.toUtf16 = function toUtf16( uint8 )
{
	return uint8Kit.readUtf16( uint8 , 0 , uint8.length ) ;
} ;




uint8Kit.fromUtf16 = function fromUtf16( str )
{
	var uint8 = new Uint8Array( str.length * 2 ) ;
	uint8Kit.writeUtf16( uint8 , str , 0 , str.length * 2 ) ;
	return uint8 ;
} ;



uint8Kit.readUtf16 = function readUtf16( uint8 , offset , byteLength )
{
	var i , iMax , uint16 ;
	
	if ( byteLength === undefined ) { byteLength = uint8.length - offset ; }
	
	iMax = Math.floor( Math.min( byteLength , uint8.length - offset ) / 2 ) ;
	
	uint16 = new Uint16Array( iMax ) ;
	
	for ( i = 0 ; i < iMax ; i ++ )
	{
		uint16[ i ] = uint8Kit.readUInt16( uint8 , offset + i * 2 ) ;
	}
	
	return String.fromCharCode.apply( undefined , uint16 ) ;
} ;



uint8Kit.writeUtf16 = function writeUtf16( uint8 , str , offset , byteLength )
{
	var i , iMax ;
	
	if ( byteLength === undefined ) { byteLength = str.length * 2 ; }
	
	iMax = Math.floor( Math.min( str.length * 2 , byteLength , uint8.length - offset ) / 2 ) ;
	
	for ( i = 0 ; i < iMax ; i ++ )
	{
		uint8Kit.writeUInt16( uint8 , str.charCodeAt( i ) , offset + i * 2 ) ;
	}
} ;




			/* UTF 8 */



// Should fix the UTF-16 surrogate pairs issues

uint8Kit.toUtf8 = function toUtf8( uint8 )
{
	return uint8Kit.readUtf8( uint8 , 0 , uint8.length ) ;
} ;




uint8Kit.fromUtf8 = function fromUtf8( str )
{
	var array = [] ;
	uint8Kit.writeUtf8( array , str , 0 , undefined , true ) ;
	return new Uint8Array( array ) ;
} ;



uint8Kit.readUtf8 = function readUtf8( uint8 , offset , byteLength )
{
	var index , indexMax , array = [] , charBytes , charIndex = 0 ;
	
	if ( byteLength === undefined ) { byteLength = uint8.length - offset ; }
	
	// Nothing can be predicted here...
	
	indexMax = Math.min( offset + byteLength , uint8.length ) ;
	
	for ( index = offset ; index < indexMax ; index += charBytes , charIndex ++ )
	{
		if ( uint8[ index ] === 0x00 )
		{
			break ;
		}
		else if ( uint8[ index ] < 0x80 )
		{
			charBytes = 1 ;
			array[ charIndex ] = uint8[ index ] ;	// 0xxxxxxx
		}
		else if ( uint8[ index ] < 0xc0 )
		{
			// We are in a middle of an unicode multibyte sequence: ignore this char!
			continue ;
		}
		else if ( uint8[ index ] < 0xe0 )
		{
			charBytes = 2 ;
			
			// Does it overflows the buffer?
			if ( index + charBytes > indexMax ) { break ; }
			
			array[ charIndex ] =
				( ( uint8[ index ] & 0x1f ) << 6 ) |	// 110xxxxx
				( uint8[ index + 1 ] & 0x3f ) ;			// 10xxxxxx
		}
		else if ( uint8[ index ] < 0xf0 )
		{
			charBytes = 3 ;
			
			// Does it overflows the buffer?
			if ( index + charBytes > indexMax ) { break ; }
			
			array[ charIndex ] =
				( ( uint8[ index ] & 0x0f ) << 12 ) |		// 1110xxxx
				( ( uint8[ index + 1 ] & 0x3f ) ) << 6 |	// 10xxxxxx
				( uint8[ index + 2 ] & 0x3f ) ;				// 10xxxxxx
		}
		else if ( uint8[ index ] < 0xf8 )
		{
			charBytes = 4 ;
			
			// Does it overflows the buffer?
			if ( index + charBytes > indexMax ) { break ; }
			
			array[ charIndex ] =
				( ( uint8[ index ] & 0x07 ) << 18 ) |		// 11110xxx
				( ( uint8[ index + 1 ] & 0x3f ) ) << 12 |	// 10xxxxxx
				( ( uint8[ index + 2 ] & 0x3f ) ) << 6 |	// 10xxxxxx
				( uint8[ index + 3 ] & 0x3f ) ;				// 10xxxxxx
		}
		else if ( uint8[ index ] < 0xfc )
		{
			charBytes = 5 ;
			
			// Does it overflows the buffer?
			if ( index + charBytes > indexMax ) { break ; }
			
			array[ charIndex ] =
				( ( uint8[ index ] & 0x03 ) << 24 ) |		// 111110xx
				( ( uint8[ index + 1 ] & 0x3f ) ) << 18 |	// 10xxxxxx
				( ( uint8[ index + 2 ] & 0x3f ) ) << 12 |	// 10xxxxxx
				( ( uint8[ index + 3 ] & 0x3f ) ) << 6 |	// 10xxxxxx
				( uint8[ index + 4 ] & 0x3f ) ;				// 10xxxxxx
		}
		else
		{
			charBytes = 6 ;
			
			// Does it overflows the buffer?
			if ( index + charBytes > indexMax ) { break ; }
			
			array[ charIndex ] =
				( ( uint8[ index ] & 0x01 ) << 30 ) |		// 1111110x
				( ( uint8[ index + 1 ] & 0x3f ) ) << 24 |	// 10xxxxxx
				( ( uint8[ index + 2 ] & 0x3f ) ) << 18 |	// 10xxxxxx
				( ( uint8[ index + 3 ] & 0x3f ) ) << 12 |	// 10xxxxxx
				( ( uint8[ index + 4 ] & 0x3f ) ) << 6 |	// 10xxxxxx
				( uint8[ index + 5 ] & 0x3f ) ;				// 10xxxxxx
		}
		
		console.log( "charbytes:" , charBytes ) ;
	}
	
	return String.fromCharCode.apply( undefined , array ) ;
} ;



uint8Kit.writeUtf8 = function writeUtf8( uint8 , str , offset , byteLength , usingArray )
{
	var index , indexMax , array = [] , charBytes , charIndex = 0 , charIndexMax = str.length , charCode ;
	
	// Nothing can be predicted here...
	
	if ( usingArray )
	{
		if ( byteLength === undefined ) { byteLength = Infinity ; }
		indexMax = offset + byteLength ;
	}
	else
	{
		if ( byteLength === undefined ) { byteLength = uint8.length - offset ; }
		indexMax = Math.min( offset + byteLength , uint8.length ) ;
	}
	
	
	for ( index = offset ; index < indexMax && charIndex < charIndexMax ; index += charBytes , charIndex ++ )
	{
		charCode = str.charCodeAt( charIndex ) ;
		
		// Unicode bytes per char guessing
		if ( charCode < 0x80 )
		{
			charBytes = 1 ;
			uint8[ index ] = charCode ;	// 0xxxxxxx
		}
		else if ( charCode < 0x0800 )
		{
			charBytes = 2 ;
			
			// Does it overflows the buffer?
			if ( index + charBytes > indexMax ) { break ; }
			
			uint8[ index ] = ( ( charCode >> 6 ) & 0x1f ) | 0xc0 ;	// 110xxxxx
			uint8[ index + 1 ] = ( charCode & 0x3f ) | 0x80 ;		// 10xxxxxx
		}
		else if ( charCode < 0x010000 )
		{
			charBytes = 3 ;
			
			// Does it overflows the buffer?
			if ( index + charBytes > indexMax ) { break ; }
			
			uint8[ index ] = ( ( charCode >> 12 ) & 0x0f ) | 0xe0 ;		// 1110xxxx
			uint8[ index + 1 ] = ( ( charCode >> 6 ) & 0x3f ) | 0x80 ;	// 10xxxxxx
			uint8[ index + 2 ] = ( charCode & 0x3f ) | 0x80 ;			// 10xxxxxx
		}
		else if ( charCode < 0x200000 )
		{
			charBytes = 4 ;
			
			// Does it overflows the buffer?
			if ( index + charBytes > indexMax ) { break ; }
			
			uint8[ index ] = ( ( charCode >> 18 ) & 0x07 ) | 0xf0 ;		// 11110xxx
			uint8[ index + 1 ] = ( ( charCode >> 12 ) & 0x3f ) | 0x80 ;	// 10xxxxxx
			uint8[ index + 2 ] = ( ( charCode >> 6 ) & 0x3f ) | 0x80 ;	// 10xxxxxx
			uint8[ index + 3 ] = ( charCode & 0x3f ) | 0x80 ;			// 10xxxxxx
		}
		else if ( charCode < 0x40000000 )
		{
			charBytes = 5 ;
			
			// Does it overflows the buffer?
			if ( index + charBytes > indexMax ) { break ; }
			
			uint8[ index ] = ( ( charCode >> 24 ) & 0x03 ) | 0xf8 ;		// 111110xx
			uint8[ index + 1 ] = ( ( charCode >> 18 ) & 0x3f ) | 0x80 ;	// 10xxxxxx
			uint8[ index + 2 ] = ( ( charCode >> 12 ) & 0x3f ) | 0x80 ;	// 10xxxxxx
			uint8[ index + 3 ] = ( ( charCode >> 6 ) & 0x3f ) | 0x80 ;	// 10xxxxxx
			uint8[ index + 4 ] = ( charCode & 0x3f ) | 0x80 ;			// 10xxxxxx
		}
		else
		{
			charBytes = 6 ;
			
			// Does it overflows the buffer?
			if ( index + charBytes > indexMax ) { break ; }
			
			uint8[ index ] = ( ( charCode >> 30 ) & 0x01 ) | 0xfc ;		// 1111110x
			uint8[ index + 1 ] = ( ( charCode >> 24 ) & 0x3f ) | 0x80 ;	// 10xxxxxx
			uint8[ index + 2 ] = ( ( charCode >> 18 ) & 0x3f ) | 0x80 ;	// 10xxxxxx
			uint8[ index + 3 ] = ( ( charCode >> 12 ) & 0x3f ) | 0x80 ;	// 10xxxxxx
			uint8[ index + 4 ] = ( ( charCode >> 6 ) & 0x3f ) | 0x80 ;	// 10xxxxxx
			uint8[ index + 5 ] = ( charCode & 0x3f ) | 0x80 ;			// 10xxxxxx
		}
		
		console.log( "charbytes:" , charBytes ) ;
	}
} ;



