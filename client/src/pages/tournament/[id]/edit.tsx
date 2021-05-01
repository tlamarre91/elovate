import { GetServerSideProps } from "next";
import { model } from "shared";
import { databaseWrapper as dbw } from "../../../services";
import EditTournamentPage, {
  EditTournamentPageProps,
} from "../../../components/edit-tournament-page";

export default EditTournamentPage;
// export function makeTournamentProps(tournament: model.Tournament): TournamentProps {
// }
export const getServerSideProps: GetServerSideProps<EditTournamentPageProps> = async ({
  params,
}) => {
  let id = params?.id;
  let props: EditTournamentPageProps = { };
  if (typeof id != "string") {
    return { props };
  }
  const tournament = await dbw.getTournament(id);
  if (tournament == null) {
    return { props };
  }
  props = tournament.toProps();
  props.id = id;
  return { props };
};
