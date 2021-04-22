import {
  useCallback,
  useEffect,
  useState
} from "react";
import {
  Button,
  InputGroup
} from "@blueprintjs/core";
import { model } from "shared";
import { handleStringChange } from "../util";

export interface ParticipantAdderProps {
  enabled?: boolean;
  name?: string;
  email?: string;
  onAdd: (p: model.TournamentParticipant) => void;
  onEnable: () => void;
}

export default function ParticipantAdder(props: ParticipantAdderProps) {
  const {
    enabled = false,
    onAdd,
    onEnable
  } = props;
  const [name, setName] = useState(props.name ?? "");
  const [email, setEmail] = useState(props.email ?? "");
  const onSubmit = useCallback(async () => {
    const p: model.TournamentParticipant = new model.TournamentParticipant({
      name, email
    });
    onAdd(p);
  }, [name, email]);
  if (!enabled) {
    return (
      <Button onClick={onEnable}>
        Add participant
      </Button>
    );
  }
  return (
    <div className="participant-adder">
      <InputGroup
        value={name}
        onChange={handleStringChange((val) => setName(val))}
        placeholder={"Participant name"}
      />
      <InputGroup
        value={email}
        onChange={handleStringChange((val) => setEmail(val))}
        placeholder={"Participant email"}
      />
      <Button onClick={onSubmit}>
        Add 'em
      </Button>
    </div>
  );
}
