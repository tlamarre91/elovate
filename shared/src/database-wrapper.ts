import firebase from "firebase/app";
import * as model from "./model";
import {
  USER_COLLECTION_ID,
  TOURNAMENT_COLLECTION_ID,
  EVENT_COLLECTION_ID,
  PARTICIPANT_COLLECTION_ID
} from "./constants";

export interface User {
  id?: string;
  username: string;
}


export interface DatabaseWrapperOptions {
  db: firebase.firestore.Firestore;
  userDocId?: string;
}

// TODO: can we make TournamentWrapper, EventWrapper, etc, and make DatabaseWrapper inherit from all?
export class DatabaseWrapper {
  db: firebase.firestore.Firestore;
  private userDocId: string | null;
  constructor(opts: DatabaseWrapperOptions) {
    this.db = opts.db;
    this.userDocId = opts.userDocId ?? null;
  }

  setUserDocId(userDocId: string | null) {
    this.userDocId = userDocId;
  }

  addTestDoc() {
    this.db.collection("123").add({ blue: 55 });
  }

  addUser(user: User) {
    const newDoc = this.db.collection(USER_COLLECTION_ID).add(user);
    return newDoc;
  }

  getUserDocRef() {
    if (this.userDocId == null) {
      throw new Error("DatabaseWrapper: userDocId not set");
    }
    return this.db.collection(USER_COLLECTION_ID).doc(this.userDocId);
  }

  getTournamentCollection() {
    return this.getUserDocRef()
      ?.collection(TOURNAMENT_COLLECTION_ID)
      .withConverter(model.tournamentConverter);
  }

  getTournamentDocRef(tournamentId: string) {
    // console.log(`getting tournament ${tournamentId} for user ${this.userDocId}`);
    return this.getTournamentCollection().doc(tournamentId);
  }

  async getTournament(tournamentId: string): Promise<model.Tournament | null> {
    const ref = this.getTournamentDocRef(tournamentId);
    const doc = await ref.get();
    return doc.data() ?? null;
  }

  getParticipantsCollection(tournamentId: string) {
    return this.getTournamentDocRef(tournamentId)
      .collection(PARTICIPANT_COLLECTION_ID)
      .withConverter(model.tournamentParticipantConverter);
  }

  async saveTournament(tournament: model.Tournament) {
    let docRef;
    if (tournament.id) {
      docRef = this.getTournamentDocRef(tournament.id);
    } else {
      docRef = this.getTournamentCollection().doc()
    }
    docRef.set(tournament);
  }

  async pushTournamentEvent(tournamentId: string, event: model.TournamentEvent) {
    const tDoc = this.getTournamentDocRef(tournamentId);
    // TODO: use withConverter
    // tDoc.collection(EVENT_COLLECTION_ID).add(event.toObject());
    throw new Error("pushTournamentEvent not yet implemented");
  }

  async pushTournamentParticipant(tournamentId: string, participant: model.TournamentParticipant) {
    await this.getParticipantsCollection(tournamentId).add(participant);
  }
}

