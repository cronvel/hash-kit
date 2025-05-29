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



function base64Tests( str , base64 , base64Url ) {
	if ( str !== undefined && base64 !== undefined ) {
		expect( hash.base64Encode( str ) ).to.be( base64 ) ;
		expect( hash.base64Decode( base64 , { to: 'utf8' } ) ).to.be( str ) ;
	}

	if ( str !== undefined && base64Url !== undefined ) {
		expect( hash.base64Encode( str , { url: true } ) ).to.be( base64Url ) ;
		expect( hash.base64Decode( base64Url , { url: true , to: 'utf8' } ) ).to.be( str ) ;
	}

	if ( base64 !== undefined && base64Url !== undefined ) {
		expect( hash.base64Encode( hash.base64Decode( base64Url , { url: true } ) ) ).to.be( base64 ) ;
		expect( hash.base64Encode( hash.base64Decode( base64 ) , { url: true } ) ).to.be( base64Url ) ;
	}
}



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
		base64Tests( undefined , 'hw+/' , 'hw-_' ) ;
	} ) ;
} ) ;



// SHA1
describe( "Fingerprint" , () => {

	it( "should give a fingerprint for any number, string or object" , () => {
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
		
		// It should be consistant when the object have keys in another order
		expect( hash.fingerprint( { a: 'more' , complex: 'object' } ) ).to.be( 'jt-uFvaG4wwRBX9r59Z6SE_jkSY' ) ;
		expect( hash.fingerprint( { complex: 'object' , a: 'more' } ) ).to.be( 'jt-uFvaG4wwRBX9r59Z6SE_jkSY' ) ;
		expect( hash.fingerprint( { a: 'more' , complex: 'object' , with: 'three' , key: '!' } ) ).to.be( 'hVv0fhtfIsCTms1kyNfqJl6tAcE' ) ;
		expect( hash.fingerprint( { with: 'three' , key: '!' , a: 'more' , complex: 'object' } ) ).to.be( 'hVv0fhtfIsCTms1kyNfqJl6tAcE' ) ;

		expect( hash.fingerprint( {
			yo: 'dawg' ,
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
		} ) ).to.be( 'RYt0eCL2pgDNCHnaUwcZjIrgckQ' ) ;

		expect( hash.fingerprint( [ 1 , 2 , 3 ] ) ).to.be( 'nvUMyCrkdCefuOgolhQnArzLszo' ) ;
		expect( hash.fingerprint( [ 3 , 1 , 2 ] ) ).to.be( 'QXUjbeBjiCQT-FWKlE5KYHV6r8U' ) ;

		expect( hash.fingerprint( [ 'one' , 'two' , 'three' ] ) ).to.be( 'RRbpaRjq1yi0FFseM2wai_3uxH0' ) ;
		expect( hash.fingerprint( [ 'two' , , 'one' , 'three' ] ) ).to.be( 'xjRRcPN78UPZ0QKIbmqWZis2RSI' ) ;

		// Check that cases produce the same result
		expect( hash.fingerprint( { B: 2 , b: 2 , a: 1 , A: 1 } ) ).to.be( hash.fingerprint( { A: 1 , a: 1 , b: 2 , B: 2 } ) ) ;
	} ) ;
} ) ;



describe( ".password()" , () => {

	it( "should create a password hash" , () => {
		expect( hash.password( 'toto' ) ).to.be( 'EOBrmQ1E3gCRohE/2VyS/JBRZq8UeqdjJjnEGqfyaxYgxHRDgTxgW5JMBVkcFh7MNZRPxpxEM6SdEPxrBKM2EQ==' ) ;
		expect( hash.password( 'toto' , '' , 'sha512' ) ).to.be( 'EOBrmQ1E3gCRohE/2VyS/JBRZq8UeqdjJjnEGqfyaxYgxHRDgTxgW5JMBVkcFh7MNZRPxpxEM6SdEPxrBKM2EQ==' ) ;
		expect( hash.password( 'toto' , '' , 'sha1' ) ).to.be( 'C5wmJdwh7wX2rU3fR8XyA4N6oyw=' ) ;
		expect( hash.password( 'toto' , '' , 'sha256' ) ).to.be( 'MfemXjFVhqwZi9eYtmKc5JA9CJlHbVdBqfMuLlIbamY=' ) ;
		expect( hash.password( 'toto' , 'salt' ) ).to.be( '4kPaD8PBo2CQ96uTtz57RrMP4jrDA7Z9ebp7YFnvyxRuyiAgxllsA69BZMv01IPudTyXtbawlW2/5FSVvQ+Rsw==' ) ;
		expect( hash.password( 'toto' , 'salt' , 'sha256' ) ).to.be( 'v4pvAFy375tQQgcpo3T+yN2chkmAL2HE6wF7Ee9eKuQ=' ) ;
	} ) ;
} ) ;



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

		var challengeParams = {
			zeroes: 20 ,
			encoding: 'base64url' ,
			algo: 'sha256' ,
			joint: ':',
			strip: true
		} ;

		result = hash.computeChallengeHash( challenge , challengeParams ) ;
		console.log( "Results:" , result ) ;
		expect( hash.verifyChallengeHash( challenge , result.counter , result.hash , challengeParams ) ).to.be.ok() ;
	} ) ;
} ) ;



describe( ".randomIdentifier()" , () => {

	it( "should create random identifier" , () => {
		console.log( "ID length 1: " + hash.randomIdentifier( 1 ) ) ;
		console.log( "ID length 3: " + hash.randomIdentifier( 3 ) ) ;
		console.log( "ID length 5: " + hash.randomIdentifier( 5 ) ) ;
		console.log( "ID length 8: " + hash.randomIdentifier( 8 ) ) ;
	} ) ;
} ) ;



describe( "random string" , () => {

	it( "should create random number string" , () => {
		console.log( "length 6: " + hash.randomNumberString( 6 ) ) ;
		console.log( "length 16: " + hash.randomNumberString( 16 ) ) ;
		console.log( "length 32: " + hash.randomNumberString( 32 ) ) ;
	} ) ;
	
	it( "should create random hex string" , () => {
		console.log( "length 6: " + hash.randomHexString( 6 ) ) ;
		console.log( "length 16: " + hash.randomHexString( 16 ) ) ;
		console.log( "length 32: " + hash.randomHexString( 32 ) ) ;
	} ) ;
	
	it( "should create random base26 string" , () => {
		console.log( "length 6: " + hash.randomBase26String( 6 ) ) ;
		console.log( "length 16: " + hash.randomBase26String( 16 ) ) ;
		console.log( "length 32: " + hash.randomBase26String( 32 ) ) ;
	} ) ;
	
	it( "should create random base36 string" , () => {
		console.log( "length 6: " + hash.randomBase36String( 6 ) ) ;
		console.log( "length 16: " + hash.randomBase36String( 16 ) ) ;
		console.log( "length 32: " + hash.randomBase36String( 32 ) ) ;
	} ) ;
	
	it( "should create random base62 string" , () => {
		console.log( "length 6: " + hash.randomBase62String( 6 ) ) ;
		console.log( "length 16: " + hash.randomBase62String( 16 ) ) ;
		console.log( "length 32: " + hash.randomBase62String( 32 ) ) ;
	} ) ;
	
	it( "should create random base64url string" , () => {
		console.log( "length 6: " + hash.randomBase64UrlString( 6 ) ) ;
		console.log( "length 16: " + hash.randomBase64UrlString( 16 ) ) ;
		console.log( "length 32: " + hash.randomBase64UrlString( 32 ) ) ;
	} ) ;
	
	it( "should create random base64 bytes to string" , () => {
		console.log( "bytelength 6: " + hash.randomBase64( 6 ) ) ;
		console.log( "bytelength 16: " + hash.randomBase64( 16 ) ) ;
		console.log( "bytelength 32: " + hash.randomBase64( 32 ) ) ;
	} ) ;
	
	it( "should create random hex bytes to string" , () => {
		console.log( "bytelength 6: " + hash.randomHex( 6 ) ) ;
		console.log( "bytelength 16: " + hash.randomHex( 16 ) ) ;
		console.log( "bytelength 32: " + hash.randomHex( 32 ) ) ;
	} ) ;
} ) ;

