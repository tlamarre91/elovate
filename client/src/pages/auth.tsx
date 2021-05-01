import * as React from "react";
import { withAuthUser, AuthAction } from "next-firebase-auth";
import FirebaseAuth from "../components/firebase-auth";
import Layout from "../components/layout";

function Auth() {
  return (
    <Layout>
      <p>test auth page</p>
      <FirebaseAuth />
    </Layout>
  );
}

// export default withAuthUser({
//   // whenAuthed: AuthAction.REDIRECT_TO_APP,
//   whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
//   whenUnauthedAfterInit: AuthAction.RENDER,
// })(Auth);
export default withAuthUser()(Auth);
