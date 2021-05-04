import firebase from "firebase/app";
import "firebase/firestore";

import { DatabaseWrapper } from "shared";
import { isClientSide } from "../util";

// let userId: string | null = "TEST_USER";
// let db: FirestoreAdminOrClient | null = null;
// let auth: firebase.auth.Auth | null = null;
// if (firebase.apps.length) {
//   db = firebase.firestore();
//   auth = firebase.auth();
// }
// const opts = {
//   db,
//   auth,
//   userId,
// };
// export const databaseWrapper: DatabaseWrapper = new DatabaseWrapper(opts);

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
    throw new Error("initializeDb: Could not initialize Firestore");
  }
}

let databaseWrapper: DatabaseWrapper | null = null;

export function getDatabaseWrapper(userId?: string) {
  if (databaseWrapper == null) {
    let firestore = firebase.firestore();
    if (firestore == undefined) {
      console.warn("getDatabaseWrapper: Could not get Firestore instance");
    }
    databaseWrapper = new DatabaseWrapper({ db: firestore, userId });
  }
  return databaseWrapper;
}
