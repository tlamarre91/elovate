import { useState } from "react";
import {
  Button,
  InputGroup
} from "@blueprintjs/core";
import { model } from "shared";
import { handleStringChange } from "../util";

export interface ParticipantAdderProps {
  enabled?: boolean;
  name?: string;
  onAdd: (p: model.TournamentParticipant) => void;
  onChange: (val: string) => void;
  onEnable: () => void;
}

export default function ParticipantAdder(props: ParticipantAdderProps) {
  const {
    enabled = false,
    name = "",
    onAdd,
    onChange,
    onEnable
  } = props;
  if (!enabled) {
    return (
      <Button onClick={onEnable}>
        Add participant
      </Button>
    );
  }
  const onSubmit = () => {
    const p: model.TournamentParticipant = {
      name
    };
    onAdd(p);
  }
  return (
    <div className="participant-adder">
      <InputGroup
        value={name}
        onChange={handleStringChange(onChange)}
        placeholder={"Add participant"}
      />
      <Button onClick={onSubmit}>
        Add 'em
      </Button>
    </div>
  );
}
