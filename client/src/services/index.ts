import { firebaseConfig } from "shared";
import firebase from "firebase/app";
import { isClientSide } from "../util";
import { initializeDb, databaseWrapper } from "./db";
import { initializeAuth } from "./auth";

/**
 * Get all services ready. (i.e. Firestore, Auth)
 */
export async function initialize() {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);

    try {
      if (!isClientSide()) {
        const admin = await import("firebase-admin");
        // console.log("Initializing Firebase admin");
        // console.log(`initializeApp: ${typeof admin.initializeApp}`);
        if (typeof admin.initializeApp != "undefined") {
          // TODO: maybe split out firebase-admin config and improve.
          admin.initializeApp(firebaseConfig);
        }
      }
    } catch (err) {
      console.warn("initialize:")
      console.warn(err);
    }

    initializeDb();
    initializeAuth();
  } else {
    console.log("initialize: already initialized");
  }
}

if (!firebase.apps.length) {
  initialize();
  // TODO: since we call this here, we probably don't have to call it again
  // when we import services.
}

export {
  databaseWrapper
};
