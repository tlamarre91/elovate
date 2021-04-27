import { useCallback, useEffect, useState, useMemo } from "react";
import Link from "next/link";
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
import { databaseWrapper as dbw } from "../services/db";
import Layout from "../components/layout";
import ParticipantAdder from "../components/participant-adder";
import ParticipantCard, {
  ParticipantCardProps,
} from "../components/participant-card";

export interface ViewTournamentPageProps extends model.TournamentProps {
  participantProps?: ParticipantCardProps[];
  subscribeToParticipants?: boolean;
}

const DEFAULT_PROPS = {
  id: null,
  name: null,
  createdAt: Date.now(),
  participants: [],
};

export default function ViewTournamentPage(props: ViewTournamentPageProps) {
  const [id, setId] = useState(props.id ?? DEFAULT_PROPS.id);
  const [name, setName] = useState(props.name ?? DEFAULT_PROPS.name);
  const [createdAt, setCreatedAt] = useState(
    props.createdAt ?? DEFAULT_PROPS.createdAt
  );
  const [participantProps, setParticipantProps] = useState(
    props.participantProps ?? []
  );
  const [addingNewParticipant, setAddingNewParticipant] = useState(false);
  const [newParticipantName, setNewParticipantName] = useState("");
  const [subscribeToParticipants, setSubscribeToParticipants] = useState(
    props.subscribeToParticipants ?? false
  );

  const pushParticipant = useCallback(
    async (participant: model.TournamentParticipant) => {
      if (id) {
        setSubscribeToParticipants(true);
        return await dbw.pushTournamentParticipant(id, participant);
      }
    },
    [newParticipantName]
  );

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

  const removeParticipant = useCallback((participantId: string) => {
    if (id) {
      setSubscribeToParticipants(true);
      dbw.deleteParticipant(id, participantId);
    }
  }, []);

  const participantList = useMemo(() => {
    console.log("participantList memo");
    const cards = participantProps.map((p) => {
      const props: ParticipantCardProps = {
        onRemove: removeParticipant,
        ...p,
      };
      return <ParticipantCard key={p.id} {...props} />;
    });

    return <div className="participant-list">{cards}</div>;
  }, [participantProps]);

  useEffect(() => {
    // TODO: unsubscribe after some timeout
    if (subscribeToParticipants && id) {
      // Creating a new array here so onSnapshot is always writing to the same
      // array so we don't have to read participantProps state. This does mean
      // we have to slice() the array to get React to see changes.
      let participantProps: ParticipantCardProps[] = [];
      const unsubscribe = dbw
        .getParticipantsCollection(id)
        .onSnapshot((snapshot) => {
          console.log("PRE");
          console.log(participantProps);
          const changes = snapshot.docChanges();
          console.log(`${changes.length} changes`);
          snapshot.docChanges().forEach((change) => {
            if (change.type == "added") {
              const data = change.doc.data();
              const newParticipant = {
                id: change.doc.id,
                name: data.name,
                email: data.email,
                createdAt: data.createdAt.toMillis(),
              };
              participantProps.push(newParticipant);
            } else if (change.type == "modified") {
              // TODO
            } else if (change.type == "removed") {
              // TODO: figure out how to use change.oldIndex to figure out
              // which participant got dropped. Not as simple as splice(oldIndex, 1).
              console.log(change.doc.id);
              console.log(change.oldIndex);
              const index = participantProps.findIndex(
                (p) => p.id == change.doc.id
              );
              participantProps.splice(index, 1);
            }
          });
          // TODO: use a reducer. This solution has behavior like rendering an
          // empty participant list when opening a new subscription.
          setParticipantProps(participantProps.slice());
        });
      // TODO: setTimeout here to call setSubscribeToParticipants(false) to
      // close subscription after timeout. But we'll need to manage the timeout
      // to reset it on user interaction.
      return unsubscribe;
    } else {
      console.log(`subscribeToParticipants: ${subscribeToParticipants}`);
    }
  }, [subscribeToParticipants]);

  return (
    <Layout>
      <div className="view-tournament-page">
        <H1>{name ?? "(no name)"}</H1>
        <Link href="/tournament/[id]/edit" as={`/tournament/${id}/edit`}>
          Edit details
        </Link>
        {participantAdder}
        {participantList}
      </div>
    </Layout>
  );
}
