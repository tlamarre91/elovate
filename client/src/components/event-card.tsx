import * as React from "react";
import { model } from "shared";
import {
  Card,
  H3,
  H4,
  Intent,
} from "@blueprintjs/core";

/**
 * User-visible indicators that event is unsaved, invalid, etc. Values are used
 * as CSS class names
 */
export enum EventCardFlag {
  Invalid = "invalid",
  Modified = "modified"
}

export interface EventCardProps {
  // TODO: rewrite TournamentCard to work this way or vice-versa.
  event: Partial<model.TournamentEvent>;
  flag?: EventCardFlag;
  onDelete?: () => void;
}

export default function EventCard(props: EventCardProps) {
  const {
    flag
  } = props;
  let className = "event-card";
  if (flag != undefined) {
    className += ` ${flag}`;
  }
  return (
    <Card interactive={false} className={className}>
      <H4>
        event-card
      </H4>
    </Card>
  );
}
