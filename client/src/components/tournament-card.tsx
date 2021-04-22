import * as React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Card,
  H3,
  H4,
} from "@blueprintjs/core";
import { model } from "shared";
import { databaseWrapper as dbw } from "../services/db";
export interface TournamentCardProps {
  tournamentSummary: model.TournamentSummary;
}

export default function TournamentCard(props: TournamentCardProps) {
  const {
    name,
    id,
    participantCount
  } = props.tournamentSummary;
  const title = name.length ? name : id;
  return (
        <Card interactive={false} className="tournament-card">
          <Link href="/tournament/[id]" as={`/tournament/${id}`}>
            <a>
                <H4>{title}</H4>
                <p>
                  {participantCount} participants
                </p>
              </a>
          </Link>
        </Card>
  );
}
