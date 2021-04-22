import firebase from "firebase/app";

export enum TournamentCategory {
  Bracket,
  RoundRobin
}

export class Tournament {
  id?: string;
  name: string;
  createdAt: firebase.firestore.Timestamp;
  category: TournamentCategory;
  participantCount: number;
  constructor(options: Partial<Tournament> = {}) {
    this.name = options.name ?? "";
    this.createdAt = options.createdAt ?? firebase.firestore.Timestamp.now();
    this.category = options.category ?? TournamentCategory.Bracket;
    this.participantCount = options.participantCount ?? 0;
  }
}

type TS_PROPS = "id"
  | "name"
  | "participantCount"
  | "category";
export type TournamentSummary = Pick<Tournament, TS_PROPS>;

function tournamentToFirestore(obj: Tournament): firebase.firestore.DocumentData {
  return { ...obj };
}

function tournamentFromFirestore(
  snapshot: firebase.firestore.QueryDocumentSnapshot,
  options: firebase.firestore.SnapshotOptions
): Tournament {
  // TODO: populate events here?
  const data = snapshot.data(options);
  return new Tournament(data);
}

export const tournamentConverter = {
  toFirestore: tournamentToFirestore,
  fromFirestore: tournamentFromFirestore
};

export class TournamentEvent {
  id?: string;
  result: [winner: number, loser: number] | null;
  createdAt?: firebase.firestore.Timestamp;
  constructor(options: Partial<TournamentEvent> = {}) {
    this.result = options.result ?? null;
    this.createdAt = options.createdAt ?? firebase.firestore.Timestamp.now()
  }
}

function eventToFirestore(obj: TournamentEvent): firebase.firestore.DocumentData {
  return { ...obj };
}

function eventFromFirestore(
  snapshot: firebase.firestore.QueryDocumentSnapshot,
  options: firebase.firestore.SnapshotOptions
): Tournament {
  // TODO: populate events here?
  const data = snapshot.data(options);
  return new Tournament(data);
}

export const tournamentEventConverter = {
  toFirestore: eventToFirestore,
  fromFirestore: eventFromFirestore
};

export class TournamentParticipant {
  id?: string;
  name: string;
  constructor(options: Partial<TournamentParticipant>) {
    this.id = options.id;
    this.name = options.name ?? "";
  }
}

function participantToFirestore(obj: TournamentParticipant): firebase.firestore.DocumentData {
  return { ...obj };
}

function participantFromFirestore(
  snapshot: firebase.firestore.QueryDocumentSnapshot,
  options: firebase.firestore.SnapshotOptions
): TournamentParticipant {
  const data = snapshot.data(options);
  return new TournamentParticipant(data);
}

export const tournamentParticipantConverter = {
  toFirestore: participantToFirestore,
  fromFirestore: participantFromFirestore
}