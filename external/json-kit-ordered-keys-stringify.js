/*
	JSON Kit

	Copyright (c) 2016 - 2022 Cédric Ronvel

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



var depthLimit = Infinity ;
var documentDepthLimit = Infinity ;
var indentString = '  ' ;







function stringify(
	v
	//, propertyMask
	, limit
) {
	if ( v === undefined ) { return undefined ; }

	var runtime = {
		str: ''
		//, depth: 0
		//, depthLimit: limit || depthLimit
		//, documentDepth: 0
		//, documentDepthLimit: limit || documentDepthLimit
		//, ancestors: []
		//, path: []
		//, refs: new WeakMap()
	} ;

	stringifyAnyType(
		v
		, runtime
		//, propertyMask
	) ;

	return runtime.str ;
}



module.exports = stringify ;



function stringifyAnyType(
	v
	, runtime
	//, propertyMask
) {
	if ( v === undefined || v === null ) {
		runtime.str += "null" ;
		return ;
	}

	switch ( typeof v ) {
		case 'boolean' :
			return stringifyBoolean( v , runtime ) ;
		case 'number' :
			return stringifyNumber( v , runtime ) ;
		case 'string' :
			return stringifyString( v , runtime ) ;
		case 'object' :
			return stringifyAnyObject(
				v
				, runtime
				//, propertyMask
			) ;
		default :
			runtime.str += "null" ;
			return ;
	}
}



function stringifyBoolean( v , runtime ) {
	runtime.str += ( v ? "true" : "false" ) ;
}



function stringifyNumber( v , runtime ) {
	if ( Number.isNaN( v ) || v === Infinity || v === -Infinity ) { runtime.str += "null" ; }
	else { runtime.str += v ; }
}



function stringifyString( v , runtime ) {
	var i = 0 , l = v.length , c ;

	// Faster on big string than stringifyStringLookup(), also big string are more likely to have at least one bad char
	if ( l >= 200 ) { return stringifyStringRegex( v , runtime ) ; }

	// Most string are left untouched, so it's worth checking first if something must be changed.
	// Gain 33% of perf on the whole stringify().
	for ( ; i < l ; i ++ ) {
		c = v.charCodeAt( i ) ;

		if (
			c <= 0x1f ||	// control chars
			c === 0x5c ||	// backslash
			c === 0x22		// double quote
		) {
			if ( l > 100 ) { stringifyStringRegex( v , runtime ) ; }
			else { stringifyStringLookup( v , runtime ) ; }
			return ;
		}
	}

	runtime.str += '"' + v + '"' ;
}



var stringifyStringLookup_ =
( function createStringifyStringLookup() {
	var c = 0 , lookup = new Array( 0x80 ) ;

	for ( ; c < 0x80 ; c ++ ) {
		if ( c === 0x09 ) {	// tab
			lookup[ c ] = '\\t' ;
		}
		else if ( c === 0x0a ) {	// new line
			lookup[ c ] = '\\n' ;
		}
		else if ( c === 0x0c ) {	// form feed
			lookup[ c ] = '\\f' ;
		}
		else if ( c === 0x0d ) {	// carriage return
			lookup[ c ] = '\\r' ;
		}
		else if ( c <= 0x0f ) {	// control chars
			lookup[ c ] = '\\u000' + c.toString( 16 ) ;
		}
		else if ( c <= 0x1f ) {	// control chars
			lookup[ c ] = '\\u00' + c.toString( 16 ) ;
		}
		else if ( c === 0x5c ) {	// backslash
			lookup[ c ] = '\\\\' ;
		}
		else if ( c === 0x22 ) {	// double-quote
			lookup[ c ] = '\\"' ;
		}
		else {
			lookup[ c ] = String.fromCharCode( c ) ;
		}
	}

	return lookup ;
} )() ;



function stringifyStringLookup( v , runtime ) {
	var i = 0 , iMax = v.length , c ;

	runtime.str += '"' ;

	for ( ; i < iMax ; i ++ ) {
		c = v.charCodeAt( i ) ;

		if ( c < 0x80 ) {
			runtime.str += stringifyStringLookup_[ c ] ;
		}
		else {
			runtime.str += v[ i ] ;
		}
	}

	runtime.str += '"' ;
}



var stringifyStringRegex_ = /[\x00-\x1f"\\]/g ;

function stringifyStringRegex( v , runtime ) {
	runtime.str += '"' + v.replace( stringifyStringRegex_ , stringifyStringRegexCallback ) + '"' ;
}

function stringifyStringRegexCallback( match ) {
	return stringifyStringLookup_[ match.charCodeAt( 0 ) ] ;
}



function stringifyAnyObject(
	v
	, runtime
	//, propertyMask
) {
	/*
	var indexOf = runtime.ancestors.indexOf( v ) ;

	if ( indexOf !== -1 ) {
		runtime.str += '{"@@ref@@":' + ( indexOf - runtime.ancestors.length ) + '}' ;
		return ;
	}
	//*/

	/*
	var path = runtime.refs.get( v ) ;

	if ( path ) {
		// /!\ Since we know for sure that 'path' is an array of string OR number, maybe we can beat JSON.stringify()'s perf on that /!\
		runtime.str += '{"@@ref@@":' + JSON.stringify( path ) + '}' ;
		//runtime.str += '{"@@ref@@":' + stringifyArrayOfStrings( path ) + '}' ;
		//runtime.str += '{"@@ref@@":' + stringifyArrayOfStrings2( path ) + '}' ;
		return ;
	}

	runtime.refs.set( v , runtime.path.slice() ) ;
	//*/

	/*
	if ( runtime.depth >= runtime.depthLimit ) {
		runtime.str += 'null' ;
		return ;
	}
	//*/

	//*
	if ( typeof v.toJSON === 'function' ) {
		stringifyAnyType(
			v.toJSON()
			, runtime
			//, propertyMask
		) ;
		return ;
	}
	//*/

	//runtime.ancestors.push( v ) ;

	if ( Array.isArray( v ) ) {
		stringifyArray(
			v
			, runtime
			//, propertyMask
		) ;
	}
	else {
		stringifyStrictObject(
			v
			, runtime
			//, propertyMask
		) ;
	}

	//runtime.ancestors.pop() ;
}



function stringifyArray(
	v
	, runtime
	//, propertyMask
) {
	var i = 1 , iMax = v.length ;

	if ( ! iMax ) {
		runtime.str += '[]' ;
		return ;
	}

	//runtime.depth ++ ;
	runtime.str += '[' ;

	//var valueIndent = '\n' + indentString.repeat( runtime.depth ) ;

	// Unroll the first iteration to avoid to test if a comma is needed for each loop iteration (gain 5% of perf)
	//runtime.path.push( 0 ) ;
	//runtime.str += valueIndent ;

	stringifyAnyType(
		v[ 0 ]
		, runtime
		//, propertyMask
	) ;

	for ( ; i < iMax ; i ++ ) {
		runtime.str += ',' ;
		//runtime.path[ runtime.path.length - 1 ] = i ;
		//runtime.str += valueIndent ;

		stringifyAnyType(
			v[ i ]
			, runtime
			//, propertyMask
		) ;
	}

	//runtime.path.pop() ;
	//runtime.depth -- ;
	//runtime.str += '\n' + indentString.repeat( runtime.depth ) ;
	runtime.str += ']' ;
}



//*
const COLLATOR = new Intl.Collator( 'en', { sensibility: 'base', numeric: true } ) ;
//*/

function stringifyStrictObject(
	v
	, runtime
	//, propertyMask
) {
	var i = 0 , iMax , keys ;

	//runtime.depth ++ ;

	/*
	if ( v._ ) {
		if ( runtime.documentDepth >= runtime.documentDepthLimit ) {
			runtime.str += 'null' ;
			return ;
		}

		runtime.documentDepth ++ ;
	}
	//*/

	keys = Object.keys( v ) ;
	/*
	keys = v.__enumerate__ ? v.__enumerate__( runtime.documentDepth ) : Object.keys( v ) ;
	//*/

	//*
	keys.sort( ( a , b ) => COLLATOR.compare( a , b ) ) ;
	//*/

	iMax = keys.length ;

	runtime.str += '{' ;

	//var keyIndent = '\n' + indentString.repeat( runtime.depth ) ;

	// Slower but use slightly less memory:
	//for ( k in v ) { if ( v[ k ] !== undefined && v.hasOwnProperty( k ) ) { ...

	for ( ; i < iMax ; i ++ ) {
		if (
			v[ keys[ i ] ] !== undefined
			//&& ( ! propertyMask || typeof propertyMask !== 'object' || propertyMask[ keys[ i ] ] )
		) {
			//runtime.str += keyIndent ;
			stringifyString( keys[ i ] , runtime ) ;
			runtime.str += ':' ;
			//runtime.str += ' ' ;
			//runtime.path.push( keys[ i ] ) ;

			stringifyAnyType(
				v[ keys[ i ] ]
				, runtime
				//, propertyMask && typeof propertyMask === 'object' && propertyMask[ keys[ i ] ]
			) ;

			// This way we avoid an if statement for the comma (gain 5% of perf)
			i ++ ;
			for ( ; i < iMax ; i ++ ) {
				if (
					v[ keys[ i ] ] !== undefined
					// jshint -W014
					//&& ( ! propertyMask || typeof propertyMask !== 'object' || propertyMask[ keys[ i ] ] )
					// jshint +W014
				) {
					runtime.str += ',' ;
					//runtime.str += keyIndent ;
					stringifyString( keys[ i ] , runtime ) ;
					runtime.str += ':' ;
					//runtime.str += ' ' ;
					//runtime.path[ runtime.path.length - 1 ] = keys[ i ] ;

					stringifyAnyType(
						v[ keys[ i ] ]
						, runtime
						//, propertyMask && typeof propertyMask === 'object' && propertyMask[ keys[ i ] ]
					) ;
				}
			}

			//runtime.path.pop() ;
			//runtime.depth -- ;
			//if ( v._ ) { runtime.documentDepth -- ; }
			//runtime.str += '\n' + indentString.repeat( runtime.depth ) ;
			runtime.str += '}' ;
			return ;
		}
	}

	//runtime.depth -- ;
	//if ( v._ ) { runtime.documentDepth -- ; }

	runtime.str += '}' ;
}



/*
function stringifyArrayOfStrings( array )
{
	var length = array.length ;

	if ( ! length ) { return '[]' ; }

	var i = 1 ,
		str = '["' + array[ 0 ] + '"' ;

	for ( ; i < length ; i ++ ) {
		str += ',"' + array[ i ] + '"' ;
	}

	return str + ']' ;
}



function stringifyArrayOfStrings2( array )
{
	var length = array.length ;

	if ( ! length ) { return '[]' ; }

	var i = 1 ,
		o = { str: '[' } ;

	stringifyString( array[ 0 ] , o ) ;

	for ( ; i < length ; i ++ ) {
		o.str += ',' ;
		stringifyString( array[ i ] , o ) ;
	}

	return o.str + ']' ;
}
*/