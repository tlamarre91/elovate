import * as React from "react";
import type * as admin from "firebase-admin";
import { firebaseConfig } from "shared";
import firebase from "firebase/app";
import { isClientSide } from "../util";
import { initializeDb } from "./db";
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
        // const db: firebase.firestore.Firestore = admin.firestore();
        // const db2: admin.firestore.Firestore = firebase.firestore();
        // const db3: FirestoreAdminOrClient = firebase.firestore();
      }
    } catch (err) {
      console.warn("initialize:")
      console.warn(err);
    }

    initializeDb();
    initializeAuth();
  } else {
    // console.log("initialize: already initialized");
  }
}
