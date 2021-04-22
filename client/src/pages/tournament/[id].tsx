import { memo, useCallback, useEffect, useState, useMemo } from "react";
import firebase from "firebase/app";
import { useRouter } from "next/router";
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";
import Head from "next/head";
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
import { handleStringChange } from "../../util";
import { model } from "shared";
import { databaseWrapper as dbw } from "../../services/db";
import Layout from "../../components/layout";
import ParticipantAdder from "../../components/participant-adder";
import ParticipantCard, {
  ParticipantCardProps,
} from "../../components/participant-card";

type ParticipantSummary = Pick<model.TournamentParticipant, "id" | "name">;

export interface EditTournamentPageProps {
  id?: string;
  name?: string;
  createdAt?: number;
  participantCount?: number;
  participants?: ParticipantSummary[];
  subscribeToParticipants?: boolean;
}

export default function EditTournamentPage(props: EditTournamentPageProps) {
  const router = useRouter();
  const [modified, setModified] = useState(false);
  const setModifiedTrue = useCallback(() => {
    if (!modified) setModified(true);
  }, []);
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
      setModified(false);
    } else {
      const docRef = await dbw
        .getTournamentCollection()
        .add(new model.Tournament(obj));
      const id = docRef.id;
      router.push(`/tournament/${id}`);
    }
  }, [name]);

  const onNameChange = (val: string) => {
    setModifiedTrue();
    setName(val);
  };

  const pushParticipant = useCallback(
    async (participant: model.TournamentParticipant) => {
      return await dbw.pushTournamentParticipant(id, participant);
    },
    [newParticipantName]
  );

  useEffect(() => {
    return dbw.getParticipantsCollection(id).onSnapshot((snapshot) => {
      const participants = snapshot.docs.map((docRef) => docRef.data());
      setParticipants(participants);
    });
  }, [id]);

  const participantAdderProps = useMemo(
    () => ({
      enabled: addingNewParticipant,
      name: newParticipantName,
      onAdd: pushParticipant,
      onEnable: () => setAddingNewParticipant(!addingNewParticipant),
    }),
    [
      addingNewParticipant,
      newParticipantName,
      pushParticipant,
      setNewParticipantName,
    ]
  );

  const participantAdder = ParticipantAdder(participantAdderProps);

  const removeParticipant = useCallback(
    (participantId: string) => {
      console.log(`remove ${participantId}, i say!!`);
      dbw.deleteParticipant(id, participantId);
    },
    [participants]
  );

  const participantList = useMemo(() => {
    const cards = participants.map((p, i) => {
      const props: ParticipantCardProps = {
        onRemove: removeParticipant,
        ...p,
      };
      return <ParticipantCard key={p.id} {...props} />;
    });

    return <div className="participant-list">{cards}</div>;
  }, [participants]);

  return (
    <Layout>
      <div className="edit-tournament-page">
        <H4>Edit tournament</H4>
        <div className="form">
          <H1>
            <EditableText
              className="name-input"
              alwaysRenderInput={false}
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
        {participantAdder}
        {participantList}
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
    props.participants = participantSnapshot.docs.map((docRef) => {
      const data = docRef.data();
      return {
        id: docRef.id,
        name: data.name,
        email: data.email,
        createdAt: data.createdAt.toMillis(),
      };
    });
  }
  props.id = id;
  props.name = tournament.name;
  props.createdAt = tournament.createdAt?.toMillis();
  props.participantCount = tournament.participantCount; // TODO: get participants or count, not both

  return { props };
};
