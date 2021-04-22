import * as React from "react";
import { Card, H3, H4 } from "@blueprintjs/core";

import EventCard, { EventCardProps } from "./event-card";

export interface EventListProps {
  eventProps: EventCardProps[];
}

export default function EventList(props: EventListProps) {
  const { eventProps } = props;
  return (
    <div className="event-list">
      {eventProps.map((props) => (
        <EventCard {...props} />
      ))}
    </div>
  );
}
