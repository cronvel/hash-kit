
import { default as hash } from '../browser/challenge-webcrypto.mjs' ; 



const CHALLENGE_PARAMS = {
	zeroes: 18 ,
	encoding: 'base64url' ,
	algo: 'sha256' ,
	joint: ':',
	strip: true
} ;



async function challenge( challenge = "grigrigredin menu fretin" ) {
	var startTime = Date.now() ;
	let browserResult = await hash.computeChallengeHash( challenge , CHALLENGE_PARAMS ) ;
	console.log( "browserResult (" + ( Date.now() - startTime ) + "ms):", browserResult ) ;
	startTime = Date.now() ;
	let match = await hash.verifyChallengeHash( challenge , browserResult.counter , browserResult.hash , CHALLENGE_PARAMS ) ;
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



//test() ;
test2() ;

