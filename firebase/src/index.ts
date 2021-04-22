import * as firebase from "firebase-admin";
import { firestore } from "firebase-admin";
import * as functions from "firebase-functions";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
if (!firebase.apps.length) firebase.initializeApp();
const db = firestore();

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  db.collection("test2").add({ blue: 42 });
  response.send("Hello from Elovate!");
});
