import { GetServerSideProps } from "next";
import { databaseWrapper as dbw } from "../../../services/db";
import ViewTournamentPage, {
  ViewTournamentPageProps,
} from "../../../components/view-tournament-page";

export default ViewTournamentPage;
export const getServerSideProps: GetServerSideProps<ViewTournamentPageProps> = async ({
  params,
}) => {
  let id = params?.id;
  // TODO: factor out getTournamentProps
  let props: ViewTournamentPageProps = {};
  if (typeof id != "string") {
    // TODO: probably throw error if it's actually something other than a
    // string or undefined.
    return { props };
  }
  const tournament = await dbw.getTournament(id);
  if (tournament == null) {
    return { props };
  }
  props = tournament.toProps();
  props.id = id;
  const participantSnapshot = await dbw.getParticipantsCollection(id).get();
  if (participantSnapshot.size) {
    props.participantProps = participantSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        email: data.email,
        createdAt: data.createdAt.toMillis(),
      };
    });
  }
  return { props };
};
