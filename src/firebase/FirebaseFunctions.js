import firebase from 'firebase/app';
import axios from 'axios';

async function doChangePassword(email, oldPassword, newPassword) {
    let credential = firebase.auth.EmailAuthProvider.credential(email, oldPassword);
    await firebase.auth().currentUser.reauthenticateWithCredential(credential);
    await firebase.auth().currentUser.updatePassword(newPassword);
    await doSignOut();
}

async function doCreateUserWithEmailAndPassword(email, password, displayName) {
    await firebase.auth().createUserWithEmailAndPassword(email, password);
    firebase.auth().currentUser.updateProfile({ displayName: displayName });
    console.log(`DISPLAY NAME ${displayName}`);
}

async function doSignInWithEmailAndPassword(email, password) {
    await firebase.auth().signInWithEmailAndPassword(email, password);
}

async function doSocialSignIn(provider) {
    let socialProvider = null;
    if (provider === "google") {
        socialProvider = new firebase.auth.GoogleAuthProvider();
    } else if (provider === "facebook") {
        socialProvider = new firebase.auth.FacebookAuthProvider();
    }
    await firebase.auth().signInWithPopup(socialProvider);
}

async function doPasswordReset(email) {
    await firebase.auth().sendPasswordResetEmail(email);
}

async function doPasswordUpdate(password) {
    await firebase.auth().updatePassword(password);
}

async function doSignOut() {
    await firebase.auth().signOut();
}

export {
    doChangePassword,
    doCreateUserWithEmailAndPassword,
    doSocialSignIn,
    doSignInWithEmailAndPassword,
    doPasswordReset,
    doPasswordUpdate,
    doSignOut
};