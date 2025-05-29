
import { hash } from '../lib/browser-challenge.mjs' ; 



async function test() {
	var challengeParams = {
		zeroes: 18 ,
		encoding: 'base64url' ,
		algo: 'sha256' ,
		joint: ':',
		strip: true
	} ;

	var challenge = "grigrigredin menu fretin" ;

	let browserResult = await hash.computeChallengeHash( challenge , challengeParams ) ;
	console.log( "browserResult:", browserResult ) ;
	let match = await hash.verifyChallengeHash( challenge , browserResult.counter , browserResult.hash , challengeParams ) ;
	console.log( "match:", match ) ;
}



// Like jQuery's $(document).ready()
const ready = callback => {
    document.addEventListener( 'DOMContentLoaded' , function internalCallback() {
        document.removeEventListener( 'DOMContentLoaded' , internalCallback , false ) ;
        callback() ;
    } , false ) ;
} ;



ready( test ) ;


