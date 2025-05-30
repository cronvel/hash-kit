
import { default as hash } from '../lib/browser-challenge.mjs' ; 
import { sha256 } from '../external/sha256.esm.js' ; 

console.log( "sha256:" , sha256 ) ;

// Like jQuery's $(document).ready()
const ready = callback => {
    document.addEventListener( 'DOMContentLoaded' , function internalCallback() {
        document.removeEventListener( 'DOMContentLoaded' , internalCallback , false ) ;
        callback() ;
    } , false ) ;
} ;



async function challenge( challenge = "grigrigredin menu fretin" ) {
	var challengeParams = {
		zeroes: 18 ,
		encoding: 'base64url' ,
		algo: 'sha256' ,
		joint: ':',
		strip: true
	} ;

	var startTime = Date.now() ;
	let browserResult = await hash.computeChallengeHash( challenge , challengeParams ) ;
	console.log( "browserResult (" + ( Date.now() - startTime ) + "ms):", browserResult ) ;
	startTime = Date.now() ;
	let match = await hash.verifyChallengeHash( challenge , browserResult.counter , browserResult.hash , challengeParams ) ;
	console.log( "match:(" + ( Date.now() - startTime ) + "ms)", match ) ;
}



async function test() {
	await challenge() ;
}



async function test2() {
	for ( let i = 0 ; i < 10 ; i ++ ) {
		await challenge( "random" + Math.random() ) ;
	}
}



ready( test ) ;
//ready( test2 ) ;


