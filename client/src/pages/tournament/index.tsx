import * as React from "react";
import { useRouter } from "next/router";
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";
import Head from 'next/head'
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
  AuthUserContext,
} from "next-firebase-auth";
import { model } from "shared";
import { databaseWrapper as dbw } from "../../services";
import Layout from "../../components/layout";
import TournamentCard from "../../components/tournament-card";

export interface TournamentIndexProps {
  tournamentSummaries: model.TournamentSummary[];
}

// Put component in ../../components/tournament-index.tsx
export default function TournamentIndex({ tournamentSummaries }: TournamentIndexProps) {
  const tournamentCards = tournamentSummaries.map((ts) => {
    return (
      <TournamentCard tournamentSummary={ts} />
    );
  })
  return (
    <Layout>
      <div>
        {tournamentCards}
      </div>
    </Layout>
  );
}

// TODO: don't use `any`. For some reason, the type that gets produced by
// passing an async function isn't compatible with GetServerSideProps.
export const getServerSideProps: any = withAuthUserTokenSSR()(async function fn(context) {
  const { AuthUser, params } = context;
  console.log("AuthUser");
  console.log(AuthUser);
  dbw.setUserDocId(AuthUser.id);
  const snapshot = await dbw.getTournamentCollection()?.get();
  // TODO: use snapshot.docChanges instead.
  const tournamentSummaries = snapshot?.docs.map((doc) => {
    const tournament = doc.data();
    return {
      name: tournament.name,
      id: doc.id,
      participantCount: tournament.participantCount
    };
  });
  return {
    props: {
      tournamentSummaries
    }
  };
});
