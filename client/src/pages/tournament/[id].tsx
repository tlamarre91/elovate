import { memo, useCallback, useEffect, useState, useMemo } from "react";
import firebase from "firebase/app";
import { useRouter } from "next/router";
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";
import Head from "next/head";
import { Button, EditableText, H1, H2, H3, H4, H5 } from "@blueprintjs/core";
import { handleStringChange } from "../../util";
import { model } from "shared";
import { databaseWrapper as dbw } from "../../services/db";
import Layout from "../../components/layout";
import ParticipantAdder from "../../components/participant-adder";

const MemoizedParticipantAdder = memo(ParticipantAdder);

export interface EditTournamentPageProps {
  id?: string;
  name?: string;
  createdAt?: number;
  participantCount?: number;
  participants?: string[];
  subscribeToParticipants?: boolean;
}

export default function EditTournamentPage(props: EditTournamentPageProps) {
  const router = useRouter();
  const [id, setId] = useState(props.id ?? undefined);
  const [name, setName] = useState(props.name ?? "");
  const [createdAt, setCreatedAt] = useState(props.createdAt ?? Date.now());
  const [participants, setParticipants] = useState(props.participants ?? []);
  const [addingNewParticipant, setAddingNewParticipant] = useState(false);
  const [newParticipantName, setNewParticipantName] = useState("");
  const onClickSave = useCallback(async () => {
    const obj = {
      name,
      createdAt: firebase.firestore.Timestamp.fromMillis(createdAt),
    };
    if (id) {
      const doc = await dbw
        .getTournamentDocRef(id)
        .set(new model.Tournament(obj));
    } else {
      const docRef = await dbw
        .getTournamentCollection()
        .add(new model.Tournament(obj));
      const id = docRef.id;
      router.push(`/tournament/${id}`);
    }
  }, [name]);

  const onNameChange = (val: string) => setName(val);
  // const onNameChange = useCallback((val) => setName(val), []);

  const pushParticipant = useCallback(
    async (participant: model.TournamentParticipant) => {
      if (id && newParticipantName.length) {
        dbw.pushTournamentParticipant(id, participant);
        setNewParticipantName("");
      }
    },
    [newParticipantName]
  );

  useEffect(() => {
    return dbw.getParticipantsCollection(id).onSnapshot((snapshot) => {});
  }, [id]);

  const participantAdder = ParticipantAdder({
    enabled: addingNewParticipant,
    name: newParticipantName,
    onAdd: (p) => pushParticipant(p),
    onChange: (val) => setNewParticipantName(val),
    onEnable: () => setAddingNewParticipant(!addingNewParticipant),
  });

  return (
    <Layout>
      <div className="edit-tournament-page">
        <H4>Edit tournament</H4>
        <div className="form">
          <H1>
            <EditableText
              className="name-input"
              alwaysRenderInput
              onChange={onNameChange}
              value={name}
              placeholder={"Name"}
            />
          </H1>
          <p className="created-at">created {new Date(createdAt).toString()}</p>
        </div>
        <Button outlined={false} onClick={onClickSave}>
          Save
        </Button>
        {participantAdder}
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<EditTournamentPageProps> = async ({
  params,
}) => {
  console.log(params);
  let id = params?.id;
  const props: EditTournamentPageProps = {};
  if (typeof id != "string") {
    return { props };
  }
  const tournament = await dbw.getTournament(id);
  if (tournament == null) {
    return { props };
  }
  const participantSnapshot = await dbw.getParticipantsCollection(id).get();
  if (participantSnapshot.size) {
    props.participants = participantSnapshot.docs.map(
      (docRef) => docRef.data().name
    );
  }
  props.id = id;
  props.name = tournament.name;
  props.createdAt = tournament.createdAt?.toMillis();
  props.participantCount = tournament.participantCount; // TODO: get participants or count, not both

  return { props };
};
