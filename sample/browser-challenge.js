
import { default as hashNative } from '../lib/browser-challenge.mjs' ; 
import { default as hashJs } from '../lib/browser-challenge-ext-sha256.mjs' ; 
//import { sha256 } from '../external/sha256.esm.js' ; 
//console.log( "sha256:" , sha256 ) ;

// Like jQuery's $(document).ready()
const ready = callback => {
    document.addEventListener( 'DOMContentLoaded' , function internalCallback() {
        document.removeEventListener( 'DOMContentLoaded' , internalCallback , false ) ;
        callback() ;
    } , false ) ;
} ;



const CHALLENGE_PARAMS = {
	zeroes: 18 ,
	encoding: 'base64url' ,
	algo: 'sha256' ,
	joint: ':',
	strip: true
} ;



async function challengeNative( challenge = "grigrigredin menu fretin" ) {
	var startTime = Date.now() ;
	let browserResult = await hashNative.computeChallengeHash( challenge , CHALLENGE_PARAMS ) ;
	console.log( "browserResult (" + ( Date.now() - startTime ) + "ms):", browserResult ) ;
	startTime = Date.now() ;
	let match = await hashNative.verifyChallengeHash( challenge , browserResult.counter , browserResult.hash , CHALLENGE_PARAMS ) ;
	console.log( "match:(" + ( Date.now() - startTime ) + "ms)", match ) ;
}



function challengeJs( challenge = "grigrigredin menu fretin" ) {
	var startTime = Date.now() ;
	let browserResult = hashJs.computeChallengeHash( challenge , CHALLENGE_PARAMS ) ;
	console.log( "browserResult (" + ( Date.now() - startTime ) + "ms):", browserResult ) ;
	startTime = Date.now() ;
	let match = hashJs.verifyChallengeHash( challenge , browserResult.counter , browserResult.hash , CHALLENGE_PARAMS ) ;
	console.log( "match:(" + ( Date.now() - startTime ) + "ms)", match ) ;
}



async function test() {
	await challengeJs() ;
	await challengeNative() ;
}



async function test2() {
	for ( let i = 0 ; i < 10 ; i ++ ) {
		await challengeNative( "random" + Math.random() ) ;
	}
}



ready( test ) ;
//ready( test2 ) ;


