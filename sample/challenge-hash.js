#!/usr/bin/env node
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



function run() {
	const CHALLENGE_PARAMS = {
		zeroes: 20 ,
		encoding: 'base64url' ,
		algo: 'sha256' ,
		joint: ':',
		strip: true
	} ;

	let challengeString = process.argv[ 2 ] || "grigrigredin menu fretin" ;

	let startTime = Date.now() ;
	let result = hash.computeChallengeHash( challengeString , CHALLENGE_PARAMS ) ;
	let computeTime = Date.now() - startTime ;

	console.log( "Computed in " + computeTime + " ms, result:" , result ) ;

	startTime = Date.now() ;
	let verified = hash.verifyChallengeHash( challengeString , result.counter , result.hash , CHALLENGE_PARAMS ) ;
	let checkTime = Date.now() - startTime ;

	console.log( "Verified in " + checkTime + " ms: " + ( verified ? "OK!" : "Not OK..." ) ) ;
}

run() ;

