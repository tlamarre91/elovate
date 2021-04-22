import firebase from "firebase/app";

export enum TournamentCategory {
  Bracket,
  RoundRobin,
}

export class Tournament {
  id: string | null;
  name: string | null;
  createdAt: firebase.firestore.Timestamp;
  category: TournamentCategory;
  participantCount: number;
  /**
   * When did we last assign randomOrderValue on this tournament's participants?
   */
  orderedAt: firebase.firestore.Timestamp | null;
  /**
   * When did we last add/remove/update a participant?
   * TODO: use a trigger to update this.
   */
  participantsChangedAt: firebase.firestore.Timestamp | null;
  constructor(options: Partial<Tournament> = {}) {
    this.id = options.id ?? null;
    this.name = options.name ?? null;
    this.createdAt = options.createdAt ?? firebase.firestore.Timestamp.now();
    this.category = options.category ?? TournamentCategory.Bracket;
    this.participantCount = options.participantCount ?? 0;
    this.orderedAt = options.orderedAt ?? null;
    this.participantsChangedAt = options.participantsChangedAt ?? null;
  }

  toProps(): TournamentProps {
    const ret = {
      // id: this.id,
      name: this.name,
      createdAt: this.createdAt.toMillis(),
      participantCount: this.participantCount,
    };
    return ret;
  }
}

/**
 * Serializable representation of a Tournament
 */
export interface TournamentProps {
  id?: string | null;
  name?: string | null;
  /**
   * Convert from Timestamp to milliseconds for serialization
   */
  createdAt?: number | null;
  participantCount?: number;
}

// TODO: not using TournamentSummary
type TS_PROPS = "id" | "name" | "participantCount" | "category";
export type TournamentSummary = Pick<Tournament, TS_PROPS>;

function tournamentToFirestore(
  obj: Tournament
): firebase.firestore.DocumentData {
  const doc = { ...obj };
  return doc;
}

// TODO: All the *FromFirestores could probably just be one function.
function tournamentFromFirestore(
  snapshot: firebase.firestore.QueryDocumentSnapshot,
  options: firebase.firestore.SnapshotOptions
): Tournament {
  // TODO: populate events here?
  const data = snapshot.data(options);
  const obj = {
    id: snapshot.id,
    ...data,
  };
  return new Tournament(obj);
}

export const tournamentConverter = {
  toFirestore: tournamentToFirestore,
  fromFirestore: tournamentFromFirestore,
};

export type WinnerLoser = [winner: number, loser: number];

export class TournamentEvent {
  id?: string;
  result: WinnerLoser | null;
  participantIds: [string, string] | null;
  createdAt?: firebase.firestore.Timestamp;
  constructor(options: Partial<TournamentEvent> = {}) {
    this.result = options.result ?? null;
    this.createdAt = options.createdAt ?? firebase.firestore.Timestamp.now();
    this.participantIds = options.participantIds ?? null;
  }
}

function eventToFirestore(
  obj: TournamentEvent
): firebase.firestore.DocumentData {
  return { ...obj };
}

function eventFromFirestore(
  snapshot: firebase.firestore.QueryDocumentSnapshot,
  options: firebase.firestore.SnapshotOptions
): Tournament {
  // TODO: populate events here?
  // TODO: grab ID like in participantFromFirestore
  const data = snapshot.data(options);
  return new Tournament(data);
}

export const tournamentEventConverter = {
  toFirestore: eventToFirestore,
  fromFirestore: eventFromFirestore,
};

export class TournamentParticipant {
  id: string | null;
  name: string | null;
  email: string | null;
  createdAt: firebase.firestore.Timestamp;
  /**
   * Used to impose a random-but-canonical ordering of the participant
   * collection.
   */
  randomOrderValue: number | null;
  constructor(options: Partial<TournamentParticipant>) {
    this.id = options.id ?? null;
    this.name = options.name ?? null;
    this.email = options.email ?? null;
    this.createdAt = options.createdAt ?? firebase.firestore.Timestamp.now();
    this.randomOrderValue = options.randomOrderValue ?? null;
  }
}

function participantToFirestore(
  obj: TournamentParticipant
): firebase.firestore.DocumentData {
  const doc = { ...obj };
  return doc;
}

function participantFromFirestore(
  snapshot: firebase.firestore.QueryDocumentSnapshot,
  options: firebase.firestore.SnapshotOptions
): TournamentParticipant {
  const data = snapshot.data(options);
  const obj = {
    id: snapshot.id,
    ...data,
  };
  return new TournamentParticipant(obj);
}

export const tournamentParticipantConverter = {
  toFirestore: participantToFirestore,
  fromFirestore: participantFromFirestore,
};
