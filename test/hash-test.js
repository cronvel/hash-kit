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

/* jshint unused:false */
/* global describe, it, before, after */



var hash = require( '../lib/hash.js' ) ;
var expect = require( 'expect.js' ) ;





			/* Helper functions */



function base64Tests( str , base64 , base64Url )
{
	if ( str !== undefined && base64 !== undefined )
	{
		expect( hash.base64Encode( str ) ).to.equal( base64 ) ;
		expect( hash.base64Decode( base64 , { to: 'utf8' } ) ).to.equal( str ) ;
	}
	
	if ( str !== undefined && base64Url !== undefined )
	{
		expect( hash.base64Encode( str , { url: true } ) ).to.equal( base64Url ) ;
		expect( hash.base64Decode( base64Url , { url: true, to: 'utf8' } ) ).to.equal( str ) ;
	}
	
	if ( base64 !== undefined && base64Url !== undefined )
	{
		expect( hash.base64Encode( hash.base64Decode( base64Url , { url: true } ) ) ).to.equal( base64 ) ;
		expect( hash.base64Encode( hash.base64Decode( base64 ) , { url: true } ) ).to.equal( base64Url ) ;
	}
}





			/* Tests */



describe( "Base64" , function() {
	
	it( "should encode and decode a string using Base64 encoding and Base64 URL encoding" , function() {
		
		base64Tests( '' , '' , '' ) ;
		base64Tests( 'Hello world' , 'SGVsbG8gd29ybGQ=' , 'SGVsbG8gd29ybGQ' ) ;
		base64Tests( 'Hello world!' , 'SGVsbG8gd29ybGQh' , 'SGVsbG8gd29ybGQh' ) ;
		base64Tests( 'Hello world!!' , 'SGVsbG8gd29ybGQhIQ==' , 'SGVsbG8gd29ybGQhIQ' ) ;
		base64Tests( 'Hello world!!!' , 'SGVsbG8gd29ybGQhISE=' , 'SGVsbG8gd29ybGQhISE' ) ;
		base64Tests( 'Hello world!!!!' , 'SGVsbG8gd29ybGQhISEh' , 'SGVsbG8gd29ybGQhISEh' ) ;
		base64Tests( 'H3110 \\/\\/021dZ! d4 `/4 1:|<3 d01142$?' , 'SDMxMTAgXC9cLzAyMWRaISBkNCBgLzQgMTp8PDMgZDAxMTQyJD8=' , 'SDMxMTAgXC9cLzAyMWRaISBkNCBgLzQgMTp8PDMgZDAxMTQyJD8' ) ;
		base64Tests( '^~#°%£µ*§$' , 'Xn4jwrAlwqPCtSrCpyQ=' , 'Xn4jwrAlwqPCtSrCpyQ' ) ;
		base64Tests( undefined , 'hw+/' , 'hw-_' ) ;
	} ) ;
} ) ;



// SHA1
describe( "Fingerprint" , function() {
	
	it( "should give a fingerprint for any number, string or object" , function() {
		
		expect( hash.fingerprint( undefined ) ).to.be( undefined ) ;
		expect( hash.fingerprint( null ) ).to.be( undefined ) ;
		expect( hash.fingerprint( true ) ).to.be( undefined ) ;
		expect( hash.fingerprint( false ) ).to.be( undefined ) ;
		
		expect( hash.fingerprint( '' ) ).to.be( '2jmj7l5rSw0yVb_vlWAYkK_YBwk' ) ;
		expect( hash.fingerprint( 'Hello world' ) ).to.be( 'e1AsOh9IyGCa4hLN-2Od7jlnP14' ) ;
		expect( hash.fingerprint( 'Hello world!' ) ).to.be( '00hq6RNueFa8QiEjhep5cJRHWAI' ) ;
		expect( hash.fingerprint( 'Hello world!!' ) ).to.be( 'pZsCdBv_J6TD4jYzLymqYExyPoU' ) ;
		expect( hash.fingerprint( 'Hello world!!!' ) ).to.be( 'ZVWqnSRfbcK1eqEzZsxsb8zKtq0' ) ;
		expect( hash.fingerprint( 'Hello world!!!!' ) ).to.be( 'tDmmBBZfD5Ps1gEXw2l_Vkup7Uc' ) ;
		
		expect( hash.fingerprint( 0 ) ).to.be( 'AAAAAAAAAAA' ) ;
		expect( hash.fingerprint( 3 ) ).to.be( 'AAAAAAAACEA' ) ;
		expect( hash.fingerprint( -3 ) ).to.be( 'AAAAAAAACMA' ) ;
		expect( hash.fingerprint( 0.111 ) ).to.be( '0SLb-X5qvD8' ) ;
		expect( hash.fingerprint( 3.1416 ) ).to.be( 'p-hILv8hCUA' ) ;
		expect( hash.fingerprint( 1024 ) ).to.be( 'AAAAAAAAkEA' ) ;
		expect( hash.fingerprint( 1234.5678 ) ).to.be( 'rfpcbUVKk0A' ) ;
		expect( hash.fingerprint( -98765.01234 ) ).to.be( 'h22LMtAc-MA' ) ;
		
		expect( hash.fingerprint( { a: 'simple object' } ) ).to.be( 'W0r4pb6K8j2fuAby23Uh09tRMWY' ) ;
		expect( hash.fingerprint( { a: 'more', complex: 'object' } ) ).to.be( 'jt-uFvaG4wwRBX9r59Z6SE_jkSY' ) ;
		expect( hash.fingerprint( {
			yo: 'dawg',
			i: 'herd yo like object' ,
			so: {
				i: 'put object' ,
				into: {
					object: {
						into: {
							object: {} ,
							so: 'you can code OO' ,
							'while': 'you code OO'
						}
					}
				}
			} ,
			dawg: '!'
		} ) ).to.be( 'PQyYIhsVh4yunqUi5C-Hedq1Vyg' ) ;
		
		expect( hash.fingerprint( [1,2,3] ) ).to.be( 'nvUMyCrkdCefuOgolhQnArzLszo' ) ;
		expect( hash.fingerprint( [ 'one' , 'two' , 'three' ] ) ).to.be( 'RRbpaRjq1yi0FFseM2wai_3uxH0' ) ;
		
	} ) ;
} ) ;



/*
// MD5
describe( "Fingerprint" , function() {
	
	it( "should give a fingerprint for any number, string or object" , function() {
		
		expect( hash.fingerprint( undefined ) ).to.be( undefined ) ;
		expect( hash.fingerprint( null ) ).to.be( undefined ) ;
		expect( hash.fingerprint( true ) ).to.be( undefined ) ;
		expect( hash.fingerprint( false ) ).to.be( undefined ) ;
		
		expect( hash.fingerprint( '' ) ).to.be( '1B2M2Y8AsgTpgAmY7PhCfg' ) ;
		expect( hash.fingerprint( 'Hello world' ) ).to.be( 'PiWWCnnbxptnTNTsZ6csYg' ) ;
		expect( hash.fingerprint( 'Hello world!' ) ).to.be( 'hvsmnRkNLIX24EaM7KQqIA' ) ;
		expect( hash.fingerprint( 'Hello world!!' ) ).to.be( 'HZTdff0FBBAYWlNblXXhhA' ) ;
		expect( hash.fingerprint( 'Hello world!!!' ) ).to.be( 'h-5zLYMWkPRbhgaxVHvQng' ) ;
		expect( hash.fingerprint( 'Hello world!!!!' ) ).to.be( '4PtDH15tYRUdK3nO25BJRQ' ) ;
		
		expect( hash.fingerprint( 0 ) ).to.be( 'AAAAAAAAAAA' ) ;
		expect( hash.fingerprint( 3 ) ).to.be( 'AAAAAAAACEA' ) ;
		expect( hash.fingerprint( -3 ) ).to.be( 'AAAAAAAACMA' ) ;
		expect( hash.fingerprint( 0.111 ) ).to.be( '0SLb-X5qvD8' ) ;
		expect( hash.fingerprint( 3.1416 ) ).to.be( 'p-hILv8hCUA' ) ;
		expect( hash.fingerprint( 1024 ) ).to.be( 'AAAAAAAAkEA' ) ;
		expect( hash.fingerprint( 1234.5678 ) ).to.be( 'rfpcbUVKk0A' ) ;
		expect( hash.fingerprint( -98765.01234 ) ).to.be( 'h22LMtAc-MA' ) ;
		
		expect( hash.fingerprint( { a: 'simple object' } ) ).to.be( 'WJ86ea_U_oFPIzWCPPnDbg' ) ;
		expect( hash.fingerprint( { a: 'more', complex: 'object' } ) ).to.be( '0wXBJSfTRdkEhAfBgyZWKA' ) ;
		expect( hash.fingerprint( {
			yo: 'dawg',
			i: 'herd yo like object' ,
			so: {
				i: 'put object' ,
				into: {
					object: {
						into: {
							object: {} ,
							so: 'you can code OO' ,
							'while': 'you code OO'
						}
					}
				}
			} ,
			dawg: '!'
		} ) ).to.be( 'GiMV0HBoL-FPWphYkNbmQA' ) ;
		
		expect( hash.fingerprint( [1,2,3] ) ).to.be( '8eRvMo5t7NVsZN1edh3Ctw' ) ;
		expect( hash.fingerprint( [ 'one' , 'two' , 'three' ] ) ).to.be( '54iNs6qLk1eoz57dmYp4kA' ) ;
		
	} ) ;
} ) ;
*/



describe( "randomIdentifier()" , function() {
	
	it( "should create random identifier" , function() {
		console.log( "ID length 1: " + hash.randomIdentifier( 1 ) ) ;
		console.log( "ID length 3: " + hash.randomIdentifier( 3 ) ) ;
		console.log( "ID length 5: " + hash.randomIdentifier( 5 ) ) ;
		console.log( "ID length 8: " + hash.randomIdentifier( 8 ) ) ;
	} ) ;
} ) ;

