import { firebaseConfig } from "shared";
import { init, InitConfig, getFirebaseAdmin } from "next-firebase-auth";
import { isClientSide } from "../util";

/**
 * Set up next-firebase-auth. TODO: cleanup
 */
export async function initializeAuth() {
  // const clientEmail = process.env.FIREBASE_CLIENT_EMAIL ?? "";
  // const databaseURL = "TODO"; // TODO
  const cookieKeys = process.env.COOKIE_SECRET_CURRENT
    ? [process.env.COOKIE_SECRET_CURRENT!, process.env.COOKIE_SECRET_PREVIOUS!]
    : undefined;
  // const config: InitConfig = {
  // use `any` so we can set debug: true. For some reason, debug is not a
  // property of InitConfig.
  const config: any = {
    debug: false,
    authPageURL: "/auth",
    appPageURL: "/",
    loginAPIEndpoint: "/api/login",
    logoutAPIEndpoint: "/api/logout",
    firebaseAuthEmulatorHost: "192.168.0.243:9099",
    // firebaseAdminInitConfig: {
    //   credential: {
    //     projectId: firebaseConfig.projectId,
    //     clientEmail,
    //     privateKey: process.env.FIREBASE_PRIVATE_KEY
    //       ? JSON.parse(process.env.FIREBASE_PRIVATE_KEY)
    //       : undefined
    //   },
    //   databaseURL,
    // },
    firebaseClientInitConfig: {
      apiKey: firebaseConfig.apiKey,
      //   authDomain: firebaseConfig.authDomain,
      //   databaseURL,
      //   projectId: firebaseConfig.projectId,
    },
    cookies: {
      name: "elovate",
      keys: cookieKeys,
      httpOnly: true,
      maxAge: 100000000, // TODO: define appropriate maxAge
      overwrite: true,
      path: "/",
      sameSite: "strict",
      secure: true, // TODO: should be true
      signed: false,
    },
  };

  init(config);
  // if (!isClientSide()) {
  //   console.info("getFirebaseAdmin");
  //   const admin = getFirebaseAdmin();
  //   console.dir(admin);
  //   console.dir(admin.auth());
  // }
}
