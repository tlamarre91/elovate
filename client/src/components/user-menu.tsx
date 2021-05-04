import { useCallback, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import firebase from "firebase/app";
import { useRouter } from "next/router";
import {
  useAuthUser,
  withAuthUser,
  AuthAction,
  AuthUserContext,
} from "next-firebase-auth";
import {
  Button,
  Intent,
  Menu,
  MenuItem,
  PopoverPosition,
} from "@blueprintjs/core";
import { Popover2 as Popover } from "@blueprintjs/popover2";

export interface UserMenuProps {
  test: number
}

function UserMenu(props: UserMenuProps) {
  const user = useAuthUser();
  const [name, setName] = useState("");
  // console.log("user");
  // console.log(user);
  // pretty sure this *doesn't* work on the server.
  // const user2 = firebase.auth().currentUser;
  // console.log("firebase.auth().currentUser");
  // console.log(user2);
  const menu = useMemo(() => {
    const name = user.email;
    if (name) {
      setName(name);
      return (
        <Menu>
          <MenuItem icon="log-out" text="Sign out" onClick={user.signOut} />
        </Menu>
      );
    } else {
      setName("");
      return (
        <Menu>
          <Link href="/auth">
            <MenuItem icon="log-in" text="Sign in" />
          </Link>
        </Menu>
      );
    }
  }, [user]);

  const popover = useMemo(() => {
    return (
      <Popover content={menu} interactionKind="click" placement="bottom">
        <Button minimal={true} icon="user" text={name} />
      </Popover>
    );
  }, [name]);
  return popover;
}

export default withAuthUser<UserMenuProps>()(UserMenu);
