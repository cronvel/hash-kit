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



const hash = require( '..' ) ;
var browserHash ;
//const browserHash = require( '../lib/browser-challenge.js' ) ;



function base64Tests( str , base64 , base64Url ) {
	var array = new Uint8Array( Buffer.from( str ) ) ;
	var computedBase64 = browserHash._arrayToBase64( array ) ;
	var computedBase64Url = browserHash._arrayToBase64Url( array ) ;
	console.log( "Base64:" , computedBase64 , computedBase64Url ) ;
	expect( computedBase64 ).to.be( base64 ) ;
	expect( computedBase64Url ).to.be( base64Url ) ;
}



describe( "Browser" , async () => {
	before( async () => {
		browserHash = ( await import( '../lib/browser-challenge.mjs' ) ).default ;
	} ) ;

	describe( "Base64" , () => {

		it( "should encode and decode a string using Base64 encoding and Base64 URL encoding" , async () => {
			base64Tests( '' , '' , '' ) ;
			base64Tests( 'Hello world' , 'SGVsbG8gd29ybGQ=' , 'SGVsbG8gd29ybGQ' ) ;
			base64Tests( 'Hello world!' , 'SGVsbG8gd29ybGQh' , 'SGVsbG8gd29ybGQh' ) ;
			base64Tests( 'Hello world!!' , 'SGVsbG8gd29ybGQhIQ==' , 'SGVsbG8gd29ybGQhIQ' ) ;
			base64Tests( 'Hello world!!!' , 'SGVsbG8gd29ybGQhISE=' , 'SGVsbG8gd29ybGQhISE' ) ;
			base64Tests( 'Hello world!!!!' , 'SGVsbG8gd29ybGQhISEh' , 'SGVsbG8gd29ybGQhISEh' ) ;
			base64Tests( 'H3110 \\/\\/021dZ! d4 `/4 1:|<3 d01142$?' , 'SDMxMTAgXC9cLzAyMWRaISBkNCBgLzQgMTp8PDMgZDAxMTQyJD8=' , 'SDMxMTAgXC9cLzAyMWRaISBkNCBgLzQgMTp8PDMgZDAxMTQyJD8' ) ;
			base64Tests( '^~#°%£µ*§$' , 'Xn4jwrAlwqPCtSrCpyQ=' , 'Xn4jwrAlwqPCtSrCpyQ' ) ;
		} ) ;
	} ) ;

	describe( "Anti-spam/anti-bot: .computeChallengeHash() and .verifyChallengeHash()" , () => {

		it( "should compute and verify a challenge hash, should be interoperable" , async function() {
			this.timeout( 8000 ) ;

			var challengeParams = {
				zeroes: 18 ,
				encoding: 'base64url' ,
				algo: 'sha256' ,
				joint: ':',
				strip: true
			} ;

			var challenge = "grigrigredin menu fretin" ;

			let browserResult = await browserHash.computeChallengeHash( challenge , challengeParams ) ;
			console.log( "Browser results:" , browserResult ) ;
			expect( await browserHash.verifyChallengeHash( challenge , browserResult.counter , browserResult.hash , challengeParams ) ).to.be.ok() ;
			expect( await browserHash.verifyChallengeHash( challenge , 'AzE4' , browserResult.hash , challengeParams ) ).not.to.be.ok() ;
			expect( await browserHash.verifyChallengeHash( challenge , browserResult.counter , 'y4' + browserResult.hash.slice( 2 )  , challengeParams) ).not.to.be.ok() ;
			expect( await browserHash.verifyChallengeHash( challenge + '!' , browserResult.counter , browserResult.hash  , challengeParams) ).not.to.be.ok() ;

			let nodeResult = hash.computeChallengeHash( challenge , challengeParams ) ;
			console.log( "Node results:" , nodeResult ) ;
			expect( nodeResult ).to.equal( browserResult ) ;
			expect( hash.verifyChallengeHash( challenge , browserResult.counter , browserResult.hash , challengeParams ) ).to.be.ok() ;
			expect( await browserHash.verifyChallengeHash( challenge , nodeResult.counter , nodeResult.hash , challengeParams ) ).to.be.ok() ;
		} ) ;
	} ) ;

} ) ;

