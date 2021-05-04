import * as React from "react";
import firebase from "firebase/app";
import { AuthUser } from "next-firebase-auth";

export interface ServicesProps {
  db?: firebase.firestore.Firestore;
  auth?: firebase.auth.Auth;
  testProp: string;
  AuthUser?: AuthUser,
}

export function withServices<P>(
  WrappedComponent: React.ComponentType<P & ServicesProps>
) {
  const serviceProps: ServicesProps = {
    testProp: "howdy",
  };
  const ComponentWithServices = (props: P) => {
    return <WrappedComponent {...props} {...serviceProps} />;
  };
  return ComponentWithServices;
}
