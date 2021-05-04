import { GetServerSideProps } from "next";
import { withAuthUserTokenSSR } from "next-firebase-auth";
import firebase from "firebase/app";
import { model } from "shared";
import { getDatabaseWrapper } from "../../../services";
import EditTournamentPage, {
  EditTournamentPageProps,
} from "../../../components/edit-tournament-page";

export const getServerSideProps: GetServerSideProps<EditTournamentPageProps> = async (context) => {
  let tournamentId = context.params?.id ?? null;
  if (typeof tournamentId != "string") {
    return { props: {} };
  }
  return { props: { tournamentId } };
}
export default EditTournamentPage;
