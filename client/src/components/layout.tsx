import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import UserMenu from "./user-menu";

export default function Layout({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="container">
      <Head>
        <title>elovate</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <div className="links">
          <Link href="/">elovate</Link>
          <Link href="/auth">auth</Link>
          <Link href="/tournament">tournament dashboard</Link>
          <Link href="/tournament/new">new tournament</Link>
          <Link href="/api/cookie-test">cookie test</Link>
          <Link href="/test">test page</Link>
        </div>
        <UserMenu />
      </header>
      <main>{children}</main>
      <footer>
        <a
          href="https://github.com/tlamarre91/elovate"
          target="_blank"
          rel="noopener noreferrer"
        >
          github.com/tlamarre91/elovate
        </a>
      </footer>
    </div>
  );
}
