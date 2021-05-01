import { DatabaseWrapper, firebaseConfig } from "shared";

import firebase from "firebase/app";
import "firebase/firestore";

let userId: string | null = "TEST_USER";
let db: firebase.firestore.Firestore | null = null;
if (firebase.apps.length) {
  db = firebase.firestore();
}
const opts = {
  db,
  userId
};
export const databaseWrapper: DatabaseWrapper = new DatabaseWrapper(opts);;

export function initializeDb() {
  console.log("initializeDb");
  if (!firebase.apps.length) {
    throw new Error("initializeDb: Firebase app not initialized");
  }

  const db = firebase.firestore();

  if (process.env.NEXT_PUBLIC_USE_FIRESTORE_EMULATOR == "true") {
    console.log("initializeDb: Using Firestore emulator");
    const host = process.env.NEXT_PUBLIC_FIRESTORE_HOST;
    const port = process.env.NEXT_PUBLIC_FIRESTORE_PORT;
    if (host == undefined || port == undefined) {
      throw new Error(
        `initializeDb: Invalid environment variables (host=${host}, port=${port})`
      );
    }
    console.log(`firestore host=${host}, port=${port}`);
    db.useEmulator(host, parseInt(port));
  }

  if (db == undefined) {
    throw new Error("initializeDb: Could not get Firestore database instance");
  }

  databaseWrapper.setDatabase(db);
}

// import "firebase/functions";

// let db: firebase.firestore.Firestore;
// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
//   db = firebase.firestore();
//   if (env.NEXT_PUBLIC_USE_FIRESTORE_EMULATOR) {
//     db.useEmulator(env.NEXT_PUBLIC_FIRESTORE_HOST, env.NEXT_PUBLIC_FIRESTORE_PORT);
//   }
// } else {
//   db = firebase.firestore();
// }

// export let databaseWrapper: DatabaseWrapper;
// if (db != undefined) {
//   const userId = "TEST_USER";
//   const opts = { db, userId };
//   databaseWrapper = new DatabaseWrapper(opts);
// } else {
//   console.error("Could not get Firestore database instance.");
// }
