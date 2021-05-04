import { useCallback, useEffect, useState, useMemo } from "react";
import firebase from "firebase/app";
import { useRouter } from "next/router";
import {
  Button,
  EditableText,
  H1,
  H2,
  H3,
  H4,
  H5,
  Intent,
  Tag,
} from "@blueprintjs/core";
import { useAuthUser, withAuthUser } from "next-firebase-auth";
import { handleStringChange } from "../util";
import { model } from "shared";
import { getDatabaseWrapper } from "../services";
import Layout from "../components/layout";
import ParticipantAdder from "../components/participant-adder";
import ParticipantCard, {
  ParticipantCardProps,
} from "../components/participant-card";

// type ParticipantSummary = Pick<model.TournamentParticipant, "id" | "name">;

export interface EditTournamentPageProps {
  tournamentId?: string | null;
}

function EditTournamentPage(props: EditTournamentPageProps) {
  const user = useAuthUser();
  const [pageReady, setPageReady] = useState(false);
  const router = useRouter();
  const [modified, setModified] = useState(false);
  const setModifiedTrue = useCallback(() => {
    if (!modified) setModified(true);
  }, []);
  const [id, setId] = useState(props.tournamentId);
  const [name, setName] = useState("");
  const [createdAt, setCreatedAt] = useState(Date.now());

  useEffect(() => {
    if (user?.id && id?.length) {
      const dbw = getDatabaseWrapper();
      dbw.getTournament(id).then((tournament) => {
        // console.log(tournament);
        if (tournament != null) {
          setName(tournament.name ?? "");
          setCreatedAt(tournament.createdAt.toMillis());
        }
        setPageReady(true);
      });
    }
  }, [user]);

  const onClickSave = useCallback(async () => {
    try {
      const obj: Partial<model.Tournament> = {
        name,
        createdAt: firebase.firestore.Timestamp.fromMillis(createdAt),
      };
      if (id) obj.id = id;
      const tournament = new model.Tournament(obj);
      const dbw = getDatabaseWrapper(); // TODO: implement useDatabaseWrapper hook
      const saved = await dbw.saveTournament(tournament);
      if (id) {
        setModified(false);
      } else {
        if (saved != undefined) {
          const id = saved.id;
          router.push(`/tournament/${id}`);
        } else {
          console.error("EditTournamentPage: could not save new tournament");
        }
      }
    } catch (err) {
      console.error("EditTournamentPage");
      console.error(err);
    }
  }, [name]);

  const onNameChange = (val: string) => {
    setModifiedTrue();
    setName(val);
  };

  return (
    <Layout>
      <div className="edit-tournament-page">
        <H4>Edit tournament</H4>
        <div className="form">
          <H1>
            {/* TODO: replace with InputGroup. EditableText seems wonky on Android */}
            <EditableText
              className="name-input"
              alwaysRenderInput={true}
              onChange={onNameChange}
              value={name}
              placeholder={"Name"}
            />
          </H1>
          <p className="created-at">created {new Date(createdAt).toString()}</p>
        </div>
        <Button
          intent={modified ? Intent.DANGER : Intent.NONE}
          outlined={false}
          onClick={onClickSave}
        >
          Save
        </Button>
      </div>
    </Layout>
  );
}

export default withAuthUser<EditTournamentPageProps>()(EditTournamentPage);
