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

export default function TournamentIndex({ tournamentSummaries }: TournamentIndexProps) {
  console.log(tournamentSummaries);
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
  const tournamentSummaries = snapshot.docs.map((docRef) => {
    const tournament = docRef.data();
    return {
      name: tournament.name,
      id: docRef.id,
      participantCount: tournament.participantCount
    };
  });
  console.log(tournamentSummaries);
  return {
    props: {
      tournamentSummaries
    }
  };
};
