
import React from 'react'
import { doSocialSignIn } from '../firebase/FirebaseFunctions'


const SocialSignIn = () => {

    const socialSignOn = async (provider) => {
        try {
            await doSocialSignIn(provider);
        }
        catch (e) {
            alert(e);
        }
    }
    return (
        <div>
            <img onClick={() => socialSignOn('google')} alt='google signin' src='/imgs/btn_google_signin.png'></img>
        </div>
    )
}
export default SocialSignIn;