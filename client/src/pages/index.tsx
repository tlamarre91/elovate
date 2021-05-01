import * as React from "react";
import { model } from "shared";
import { databaseWrapper as dbw } from "../services";
import Layout from "../components/layout";

export default function Home() {
  return (
    <Layout>
        <h1 className="title">
          Elovate!
        </h1>
    </Layout>
  )
}
