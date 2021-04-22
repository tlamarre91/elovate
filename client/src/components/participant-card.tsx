import { useCallback, useEffect, useState } from "react";
import { Button, Card, H3, H4 } from "@blueprintjs/core";
import { model } from "shared";
import { handleStringChange } from "../util";

export interface ParticipantCardProps {
  selected?: boolean;
  id?: string;
  name?: string;
  email?: string;
  onRemove?: (participantId: string) => void;
}

export default function ParticipantCard(props: ParticipantCardProps) {
  const { id, name, email, onRemove } = props;
  return (
    <Card className="participant-card">
      <div className="top">
        <div className="participant-name">{name}</div>
        <Button
          minimal={true}
          className="participant-delete"
          icon="cross"
          onClick={() => {
            if (id != undefined) onRemove?.(id);
          }}
        />
      </div>
      <div className="content">
        <div className="participant-email">{email}</div>
      </div>
    </Card>
  );
}
