import firebase from "firebase/app";
import * as model from "./model";
import {
  USER_COLLECTION_ID,
  TOURNAMENT_COLLECTION_ID,
  EVENT_COLLECTION_ID,
  PARTICIPANT_COLLECTION_ID,
} from "./constants";

const DEBUG = true;
function debugLog(...args: any[]) {
  if (DEBUG) {
    console.log(args);
  }
}

/**
 * How much time must pass before a given participants collection can be reordered?
 */
const REORDER_DELAY_MS = 3000;

/**
 * Return an object with randomOrderValue property, to be passed in update to a
 * TournamentParticipant.
 */
const _makeRov = () => ({ randomOrderValue: Math.random() });

// TODO: can we make TournamentWrapper, EventWrapper, etc, and make
// DatabaseWrapper inherit from all?
export class DatabaseWrapper {
  db: firebase.firestore.Firestore | null;
  auth: firebase.auth.Auth | null;
  userId: string | null;

  constructor(opts: Partial<DatabaseWrapper> = {}) {
    this.db = opts.db ?? null;
    this.auth = opts.auth ?? null;
    this.userId = opts.userId ?? null;
  }

  // TODO: don't really need these setters
  setDatabase(db: firebase.firestore.Firestore) {
    this.db = db;
  }

  setAuth(auth: firebase.auth.Auth) {
    this.auth = auth;
  }

  // setUserId(userId: string | null) {
  //   this.userId = userId;
  // }

  addTestDoc(userId: string, collectionId: string, doc: any) {
    debugLog("adding test doc");
    this.getUserDocRef(userId)?.collection(collectionId).add(doc ?? { blue: 55 });
  }

  // addUser(user: User) {
  //   const newDoc = this.db?.collection(USER_COLLECTION_ID).add(user);
  //   return newDoc;
  // }

  getUserDocRef(userId?: string) {
    if (userId != undefined) {
      const doc = this.db?.collection(USER_COLLECTION_ID).doc(userId);
      return doc;
    } else {
      const auth = firebase.auth();
      let uid = auth?.currentUser?.uid;
      debugLog(`getUserDocRef: ${uid}`);
      if (uid == undefined) {
        uid = this.userId ?? undefined;
        // throw new Error("DatabaseWrapper: request not authenticated");
      }
      const doc = this.db?.collection(USER_COLLECTION_ID).doc(uid);
      return doc;
    }
  }

  getTournamentCollection() {
    let ret = this.getUserDocRef()?.collection(TOURNAMENT_COLLECTION_ID);
    debugLog("getTournamentCollection: ", ret);
    return ret;
  }

  getTournamentDocRef(tournamentId: string) {
    // TODO: don't use withConverter here
    return (
      this.getTournamentCollection()
        // ?.withConverter(model.tournamentConverter)
        ?.doc(tournamentId)
    );
  }

  async getTournament(tournamentId: string): Promise<model.Tournament | null> {
    const ref = this.getTournamentDocRef(tournamentId)?.withConverter(
      model.tournamentConverter
    );
    const doc = await ref?.get();
    return doc?.data() ?? null;
  }

  /**
   * Add or update a tournament, depending on whether tournament.id is set.
   */
  async saveTournament(tournament: model.Tournament) {
    let docRef:
      | firebase.firestore.DocumentReference<model.Tournament>
      | undefined;
    if (tournament.id) {
      docRef = this.getTournamentDocRef(tournament.id)?.withConverter(
        model.tournamentConverter
      );
    } else {
      docRef = this.getTournamentCollection()
        ?.withConverter(model.tournamentConverter)
        .doc();
    }
    await docRef?.set(tournament);
    return docRef;
  }

  getParticipantsCollection(tournamentId: string) {
    return this.getTournamentDocRef(tournamentId)
      ?.collection(PARTICIPANT_COLLECTION_ID)
      .withConverter(model.tournamentParticipantConverter);
    // TODO: make callers call withConverter themselves
  }

  async pushTournamentParticipant(
    tournamentId: string,
    participant: model.TournamentParticipant
  ) {
    // TODO: update tournament.participantCount
    await this.getParticipantsCollection(tournamentId)?.add(participant);
  }

  deleteParticipant(tournamentId: string, participantId: string) {
    // TODO: update tournament.participantCount
    return this.getParticipantsCollection(tournamentId)
      ?.doc(participantId)
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
    if (!t?.id?.length) {
      return;
    }
    const dt = Date.now() - (t.orderedAt?.toMillis() ?? 0);
    if (dt < REORDER_DELAY_MS) {
      throw new Error(
        `Can't randomize participants faster than once every ${REORDER_DELAY_MS} ms`
      );
    }
    if (participantIds?.length) {
      participantIds.forEach((id) => {
        this.getParticipantsCollection(tournamentId)
          ?.doc(id)
          .update(_makeRov());
      });
    } else {
      const ps = await this.getParticipantsCollection(tournamentId)?.get();
      ps?.forEach((doc) => {
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
