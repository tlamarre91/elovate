import firebase from "firebase/app";
import * as model from "./model";
import {
  USER_COLLECTION_ID,
  TOURNAMENT_COLLECTION_ID,
  EVENT_COLLECTION_ID,
  PARTICIPANT_COLLECTION_ID,
} from "./constants";

/**
 * How much time must pass before a given participants collection can be reordered?
 */
const REORDER_DELAY_MS = 3000;

/**
 * Return an object with randomOrderValue property, to be passed in update to a
 * TournamentParticipant.
 */
const _makeRov = () => ({ randomOrderValue: Math.random() });

export interface User {
  id?: string;
  username: string;
}

export interface DatabaseWrapperOptions {
  db: firebase.firestore.Firestore;
  userDocId?: string;
}

// TODO: can we make TournamentWrapper, EventWrapper, etc, and make
// DatabaseWrapper inherit from all?
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

  getTournamentCollection(useConverter = true) {
    let ret = this.getUserDocRef()?.collection(TOURNAMENT_COLLECTION_ID);
    if (useConverter) ret = ret.withConverter(model.tournamentConverter);
    return ret;
  }

  getTournamentDocRef(tournamentId: string) {
    // console.log(`getting tournament ${tournamentId} for user ${this.userDocId}`);
    return this.getTournamentCollection()
      .withConverter(model.tournamentConverter)
      .doc(tournamentId);
  }

  async getTournament(tournamentId: string): Promise<model.Tournament | null> {
    const ref = this.getTournamentDocRef(tournamentId);
    const doc = await ref.get();
    return doc.data() ?? null;
  }

  /**
   * Add or update a tournament, depending on whether tournament.id is set.
   */
  async saveTournament(tournament: model.Tournament) {
    let docRef: firebase.firestore.DocumentReference<model.Tournament>;
    if (tournament.id) {
      docRef = this.getTournamentDocRef(tournament.id);
    } else {
      docRef = this.getTournamentCollection()
        .withConverter(model.tournamentConverter)
        .doc();
    }
    await docRef.set(tournament);
    return docRef;
  }

  getParticipantsCollection(tournamentId: string) {
    return this.getTournamentDocRef(tournamentId)
      .collection(PARTICIPANT_COLLECTION_ID)
      .withConverter(model.tournamentParticipantConverter);
    // TODO: make callers call withConverter themselves
  }

  async pushTournamentParticipant(
    tournamentId: string,
    participant: model.TournamentParticipant
  ) {
    // TODO: update tournament.participantCount
    await this.getParticipantsCollection(tournamentId).add(participant);
  }

  deleteParticipant(tournamentId: string, participantId: string) {
    // TODO: update tournament.participantCount
    return this.getParticipantsCollection(tournamentId)
      .doc(participantId)
      .delete();
  }

  // TODO: Rate-limit this function (probably by checking tournament.orderedAt)
  // since it's N reads, N writes.
  // TODO: Can we do this with a batched write?
  /**
   * Set the "random" field on each participant of a tournament.
   * @param participantIds
   *   List of IDs of participants to randomize, rather than updating all
   */
  async randomizeParticipants(tournamentId: string, participantIds?: string[]) {
    const t = await this.getTournament(tournamentId);
    if (! t?.id?.length) {
      return;
    }
    const dt = Date.now() - (t.orderedAt?.toMillis() ?? 0);
    if (dt < REORDER_DELAY_MS) {
      throw new Error(`Can't randomize participants faster than once every ${REORDER_DELAY_MS} ms`);
    }
    if (participantIds?.length) {
      participantIds.forEach((id) => {
        this.getParticipantsCollection(tournamentId).doc(id).update(_makeRov());
      });
    } else {
      const ps = await this.getParticipantsCollection(tournamentId).get();
      ps.forEach((doc) => {
        doc.ref.update(_makeRov());
      });
    }
  }

  async pushTournamentEvent(
    tournamentId: string,
    event: model.TournamentEvent
  ) {
    const tDoc = this.getTournamentDocRef(tournamentId);
    // TODO: use withConverter
    // tDoc.collection(EVENT_COLLECTION_ID).add(event.toObject());
    throw new Error("pushTournamentEvent not yet implemented");
  }
}
