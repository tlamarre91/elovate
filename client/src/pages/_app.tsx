import type { AppProps } from "next/app";
import { initialize } from "../services";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";
import "firebaseui/dist/firebaseui.css";
import "../style.scss";

initialize();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Component {...pageProps} />
  );
}
