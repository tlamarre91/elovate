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

export interface UserMenuProps {}

function UserMenu(props: UserMenuProps) {
  const user = useAuthUser();
  console.log(user);
  const user2 = firebase.auth().currentUser;
  console.log(user2);
  const name = user.email;
  const menu = useMemo(() => {
    if (name) {
      return (
        <Menu>
          <MenuItem icon="log-out" text="Sign out" onClick={user.signOut} />
        </Menu>
      );
    } else {
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
  }, [user]);
  return popover;
}

export default withAuthUser()(UserMenu);
