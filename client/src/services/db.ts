import { env, DatabaseWrapper, firebaseConfig } from "shared";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/functions";

let db: firebase.firestore.Firestore;
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
  if (env.USE_FIRESTORE_EMULATOR) {
    db.useEmulator(env.FIRESTORE_HOST, env.FIRESTORE_PORT);
  }
} else {
  db = firebase.firestore();
}

export let databaseWrapper: DatabaseWrapper;
if (db != undefined) {
  const userDocId = "TEST_USER";
  const opts = { db, userDocId };
  databaseWrapper = new DatabaseWrapper(opts);
} else {
  console.error("Could not get Firestore database instance.");
}

