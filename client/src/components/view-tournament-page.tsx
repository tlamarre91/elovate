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

  const pushParticipant = useCallback(
    async (participant: model.TournamentParticipant) => {
      if (id) {
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
      dbw.deleteParticipant(id, participantId);
    }
  }, []);

  const participantList = useMemo(() => {
    const cards = participantProps.map((p) => {
      const props: ParticipantCardProps = {
        onRemove: removeParticipant,
        ...p,
      };
      return <ParticipantCard key={p.id} {...props} />;
    });

    return <div className="participant-list">{cards}</div>;
  }, [participantProps]);

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
