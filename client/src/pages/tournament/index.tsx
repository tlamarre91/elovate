import * as React from "react";
import type firebase from "firebase/app";
import { useRouter } from "next/router";
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";
import Head from "next/head";
import { useAuthUser, withAuthUser } from "next-firebase-auth";
import { model } from "shared";
import { getDatabaseWrapper } from "../../services";
import Layout from "../../components/layout";
import TournamentCard, {
  TournamentCardProps,
} from "../../components/tournament-card";

export interface TournamentIndexProps {
  // tournamentSummaries: model.TournamentSummary[];
}

// TODO: Put component in ../../components/tournament-index.tsx
function TournamentIndex(props: TournamentIndexProps) {
  const user = useAuthUser();
  const [tournamentCardProps, setTournamentCardProps] = React.useState<
    TournamentCardProps[]
  >([]);
  const tournamentCards = tournamentCardProps.map((props) => {
    return <TournamentCard {...props} />;
  });

  React.useEffect(() => {
    if (user?.id) {
      const dbw = getDatabaseWrapper();
      const snapshot = dbw
        .getTournamentCollection()
        ?.get()
        .then((snapshot) => {
          const tournamentCardProps: TournamentCardProps[] = snapshot?.docs.map(
            (doc) => {
              const tournament = doc.data();
              return {
                name: tournament.name ?? null,
                id: doc.id ?? null,
                participantCount: tournament.participantCount ?? null,
              };
            }
          );
          setTournamentCardProps(tournamentCardProps);
        });
    }
  }, [user]);

  return (
    <Layout>
      <div>{tournamentCards}</div>
    </Layout>
  );
}

export default withAuthUser<TournamentIndexProps>()(TournamentIndex);
