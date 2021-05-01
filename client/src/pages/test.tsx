import * as React from "react";
import { useAuthUser, withAuthUser, AuthAction } from "next-firebase-auth";
import FirebaseAuth from "../components/firebase-auth";
import Layout from "../components/layout";

function Test() {
  const authUser = useAuthUser();
  return (
    <Layout>
      <p>{authUser.email}</p>
    </Layout>
  );
}

export default withAuthUser()(Test);
