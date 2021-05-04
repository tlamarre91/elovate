import React, { useEffect, useMemo, useState } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase/app";
import "firebase/auth";

import { isClientSide } from "../util";

// import { initialize } from "../services";
// initialize();

const firebaseAuthConfig = {
  signInFlow: "popup",
  // Auth providers
  // https://github.com/firebase/firebaseui-web#configure-oauth-providers
  signInOptions: [
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: false,
    },
    // {
    //   provider: firebase.auth.GoogleAuthProvider
    // }
  ],
  signInSuccessUrl: "/",
  credentialHelper: "none",
  callbacks: {
    // https://github.com/firebase/firebaseui-web#signinsuccesswithauthresultauthresult-redirecturl
    signInSuccessWithAuthResult: () =>
      // Don't automatically redirect. We handle redirecting based on
      // auth state in withAuthComponent.js.
      false,
  },
};

function FirebaseAuth() {
  // Do not SSR FirebaseUI, because it is not supported.
  // https://github.com/firebase/firebaseui-web/issues/213
  const fbAuth = firebase.auth();
  const styledFirebaseAuth = useMemo(() => {
    return isClientSide() ? (
      <StyledFirebaseAuth uiConfig={firebaseAuthConfig} firebaseAuth={fbAuth} />
    ) : null;
  }, []);
  // useEffect(() => {
  //   const unsub = firebase.auth().onAuthStateChanged(user => {
  //     console.log("FirebaseAuth");
  //     console.log(user);
  //   });
  //   return unsub;
  // }, []);
  return <div>{styledFirebaseAuth}</div>;
}

export default FirebaseAuth;
