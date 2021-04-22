import firebase from "firebase/app";
import { firebaseConfig } from "./firebase-config";
export * from "./database-wrapper";
export * as model from "./model";

export function test() {
  const a = 4;
  console.log(a);
}

export { firebaseConfig };
export * as env from "./env.dev";
