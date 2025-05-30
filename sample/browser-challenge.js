
import { default as hash } from '../browser/challenge-sha256.mjs' ; 



const CHALLENGE_PARAMS = {
	zeroes: 20 ,
	encoding: 'base64url' ,
	algo: 'sha256' ,
	joint: ':',
	strip: true
} ;



function challenge( challenge = "grigrigredin menu fretin" ) {
	var startTime = Date.now() ;
	let browserResult = hash.computeChallengeHash( challenge , CHALLENGE_PARAMS ) ;
	console.log( "browserResult (" + ( Date.now() - startTime ) + "ms):", browserResult ) ;
	startTime = Date.now() ;
	let match = hash.verifyChallengeHash( challenge , browserResult.counter , browserResult.hash , CHALLENGE_PARAMS ) ;
	console.log( "match:(" + ( Date.now() - startTime ) + "ms)", match ) ;
}



function test() {
	challenge() ;
}



function test2() {
	for ( let i = 0 ; i < 10 ; i ++ ) {
		challenge( "random" + Math.random() ) ;
	}
}



//test() ;
test2() ;

