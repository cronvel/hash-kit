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
const browserHash = require( '../lib/browser-challenge.js' ) ;



function base64Tests( str , base64 , base64Url ) {
	var array = new Uint8Array( Buffer.from( str ) ) ;
	var computedBase64 = browserHash._arrayToBase64( array ) ;
	var computedBase64Url = browserHash._arrayToBase64Url( array ) ;
	console.log( "Base64:" , computedBase64 , computedBase64Url ) ;
	expect( computedBase64 ).to.be( base64 ) ;
	expect( computedBase64Url ).to.be( base64Url ) ;
}



describe( "Browser" , () => {

	describe( "Base64" , () => {

		it( "should encode and decode a string using Base64 encoding and Base64 URL encoding" , () => {
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


	return ;
	describe( "Anti-spam/anti-bot: .computeChallengeHash() and .verifyChallengeHash()" , () => {

		it( "should compute and verify a challenge hash" , function() {
			this.timeout( 8000 ) ;
			var challenge = "grigrigredin menu fretin" ;
			let result = hash.computeChallengeHash( challenge ) ;
			console.log( "Results:" , result ) ;
			expect( hash.verifyChallengeHash( challenge , result.counter , result.hash ) ).to.be.ok() ;
			expect( hash.verifyChallengeHash( challenge , 'AzE4' , result.hash ) ).not.to.be.ok() ;
			expect( hash.verifyChallengeHash( challenge , result.counter , 'y4' + result.hash.slice( 2 ) ) ).not.to.be.ok() ;
			expect( hash.verifyChallengeHash( challenge + '!' , result.counter , result.hash ) ).not.to.be.ok() ;
		} ) ;

		it( "should accept different parameters (algo, joint, zeroes, encoding, strip) for computing and verifying a challenge hash" , function() {
			this.timeout( 16000 ) ;

			var challengeParams = {
				zeroes: 22 ,
				encoding: 'hex' ,
				algo: 'sha1' ,
				joint: '|',
				strip: false
			} ;

			var challenge = "grigrigredin menu fretin" ;
			let result = hash.computeChallengeHash( challenge , challengeParams ) ;
			console.log( "Results:" , result ) ;
			expect( hash.verifyChallengeHash( challenge , result.counter , result.hash , challengeParams ) ).to.be.ok() ;
			expect( hash.verifyChallengeHash( challenge , 'AzE4' , result.hash , challengeParams ) ).not.to.be.ok() ;
			expect( hash.verifyChallengeHash( challenge , result.counter , 'y4' + result.hash.slice( 2 )  , challengeParams) ).not.to.be.ok() ;
			expect( hash.verifyChallengeHash( challenge + '!' , result.counter , result.hash  , challengeParams) ).not.to.be.ok() ;
		} ) ;
	} ) ;

} ) ;

