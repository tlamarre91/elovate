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
import {
  useAuthUser,
  withAuthUser,
} from "next-firebase-auth";
import { handleStringChange } from "../util";
import { model } from "shared";
import { getDatabaseWrapper } from "../services";
import Layout from "../components/layout";
import ParticipantAdder from "../components/participant-adder";
import ParticipantCard, {
  ParticipantCardProps,
} from "../components/participant-card";

export interface ViewTournamentPageProps {
  tournamentId?: string | null;
  subscribeToParticipants?: boolean;
}

const DEFAULT_PROPS: model.TournamentProps = {
  id: null,
  name: null,
  createdAt: Date.now(),
};

function ViewTournamentPage(props: ViewTournamentPageProps) {
  const user = useAuthUser();
  const [pageReady, setPageReady] = useState(false);
  const [id, setId] = useState(props.tournamentId ?? DEFAULT_PROPS.id);
  const [name, setName] = useState(DEFAULT_PROPS.name);
  const [createdAt, setCreatedAt] = useState(DEFAULT_PROPS.createdAt);
  const [participantProps, setParticipantProps] = useState<
    ParticipantCardProps[]
  >([]);
  const [addingNewParticipant, setAddingNewParticipant] = useState(false);
  const [newParticipantName, setNewParticipantName] = useState("");
  const [subscribeToParticipants, setSubscribeToParticipants] = useState(
    props.subscribeToParticipants ?? true
  );

  useEffect(() => {
    if (user?.id && id?.length) {
      const dbw = getDatabaseWrapper();
      dbw.getTournament(id).then((tournament) => {
        if (tournament != null) {
          // setId(tournament.id);
          setName(tournament.name);
          setCreatedAt(tournament.createdAt.toMillis());
        }
        setPageReady(true);
      });
    }
  }, [user]);

  const pushParticipant = useCallback(
    async (participant: model.TournamentParticipant) => {
      if (id) {
        const dbw = getDatabaseWrapper();
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
      const dbw = getDatabaseWrapper();
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

  useEffect(() => {
    // TODO: unsubscribe after some timeout
    if (!(subscribeToParticipants && id && user)) {
      return;
    }
    // Creating a new array here so onSnapshot is always writing to the same
    // array so we don't have to read participantProps state. This does mean
    // we have to slice() the array to get React to see changes.
    let participantProps: ParticipantCardProps[] = [];
    const dbw = getDatabaseWrapper();
    const unsubscribe = dbw
      .getParticipantsCollection(id)
      ?.onSnapshot((snapshot) => {
        // const changes = snapshot.docChanges();
        // console.log(`onSnapshot: got ${changes.length} changes`);
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
            const index = participantProps.findIndex(
              (p) => p.id == change.doc.id
            );
            if (index == -1) {
              // TODO: can we expect to get "modified" change.type for a
              // participant.id we haven't seen?
            }
          } else if (change.type == "removed") {
            const index = participantProps.findIndex(
              (p) => p.id == change.doc.id
            );
            if (index == -1) return;
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
  }, [user, subscribeToParticipants]);

  return !pageReady ? <Layout /> : (
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

export default withAuthUser<ViewTournamentPageProps>()(ViewTournamentPage);
