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
import { handleStringChange } from "../util";
import { model } from "shared";
import { databaseWrapper as dbw } from "../services";
import Layout from "../components/layout";
import ParticipantAdder from "../components/participant-adder";
import ParticipantCard, {
  ParticipantCardProps,
} from "../components/participant-card";

type ParticipantSummary = Pick<model.TournamentParticipant, "id" | "name">;

export interface EditTournamentPageProps extends model.TournamentProps {}

export default function EditTournamentById(props: EditTournamentPageProps) {
  const router = useRouter();
  const [modified, setModified] = useState(false);
  const setModifiedTrue = useCallback(() => {
    if (!modified) setModified(true);
  }, []);
  const [id, setId] = useState(props.id ?? null);
  const [name, setName] = useState(props.name ?? "");
  const [createdAt, setCreatedAt] = useState(props.createdAt ?? Date.now());
  const onClickSave = useCallback(async () => {
    const obj: Partial<model.Tournament> = {
      name,
      createdAt: firebase.firestore.Timestamp.fromMillis(createdAt),
    };
    if (id) obj.id = id;
    const tournament = new model.Tournament(obj);
    const saved = await dbw.saveTournament(tournament);
    if (id) {
      setModified(false);
    } else {
      const id = saved.id;
      router.push(`/tournament/${id}`);
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
