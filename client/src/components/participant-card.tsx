import { useCallback, useEffect, useState } from "react";
import { Button, Card, H3, H4 } from "@blueprintjs/core";
import { model } from "shared";
import { handleStringChange } from "../util";

// TODO: factor out ParticipantProps
export interface ParticipantCardProps {
  selected?: boolean;
  id?: string | null;
  name?: string | null;
  email?: string | null;
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
          className="participant-delete-button"
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
