import * as React from "react";
import Head from "next/head";
import Link from "next/link";

export default function Layout({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="container">
      <Head>
        <title>elovate</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <Link href="/">
          elovate
        </Link>
        <Link href="/tournament">
          tournament dashboard
        </Link>
        <Link href="/tournament/new">
          new tournament
        </Link>
      </header>
      <main>
        {children}
      </main>
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
