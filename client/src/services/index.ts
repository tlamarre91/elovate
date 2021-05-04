import firebase from "firebase/app";
import { initialize } from "./initialize";

if (!firebase.apps.length) {
  initialize();
}

export * from "./db";
