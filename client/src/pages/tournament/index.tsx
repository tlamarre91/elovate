import * as React from "react";
import { useRouter } from "next/router";
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";
import Head from 'next/head'
import { model } from "shared";
import { databaseWrapper as dbw } from "../../services/db";
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

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const snapshot = await dbw.getTournamentCollection().get();
  // TODO: use snapshot.docChanges instead.
  const tournamentSummaries = snapshot.docs.map((doc) => {
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
};
