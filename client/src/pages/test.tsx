import * as React from "react";
import firebase from "firebase/app";
import { useAuthUser, withAuthUser, AuthAction } from "next-firebase-auth";
import { Button, InputGroup } from "@blueprintjs/core";
import { getDatabaseWrapper } from "../services";
import { handleStringChange } from "../util";
import FirebaseAuth from "../components/firebase-auth";
import Layout from "../components/layout";

function Test() {
  const authUser = useAuthUser();
  const [uid, setUid] = React.useState("");
  const onClick = () => {
    const dbw = getDatabaseWrapper();
    dbw.addTestDoc(uid, "tournaments", { test: "123" });
  };
  return (
    <Layout>
      <p>{authUser.email}</p>
      <p>current user ID: {authUser.id}</p>
      <InputGroup
        onChange={handleStringChange((s) => setUid(s))}
        value={uid ?? ""}
      />
      <Button onClick={onClick} text="test" />
    </Layout>
  );
}

export default withAuthUser()(Test);
