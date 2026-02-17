import { render, useKeyboard, useRenderer, useTerminalDimensions } from "@opentui/solid";
import { createEffect, createSignal, Show, createContext } from "solid-js";

import MainSet from "./components/mainset";
import OpenSet from "./components/openset";
import CreateSet from "./components/createset";

type state = "menu" | "creating" | "opening" | "main";

export const FileContext = createContext();
export const StateContext = createContext();

function App() {
  const [appState, setAppState] = createSignal<state>("menu");
  const [fileState, setFileState] = createSignal({});

  const renderer = useRenderer();

  useKeyboard((key) => {
    if (appState() == "menu") {
      if (key.name === "n") {
        setAppState("creating")
      }
      if (key.name === "o") {
        setAppState("opening")
      }
    }
  })


  createEffect(() => {
    renderer.console.show();
    console.log(fileState());
    console.log(appState());
  });


  return (
    <StateContext.Provider value={[appState, setAppState]}>
      <FileContext.Provider value={[fileState, setFileState]}>
        <Show when={appState() == "menu"}>
          <box alignItems="center" justifyContent="center" flexGrow={1} >
            <ascii_font text="QUIZTUI" />
            <box>
              <text>n. create new set</text>
              <text>o. open set</text>
            </box>
          </box >
        </Show >
        <Show when={appState() == "main"}>
          <MainSet />
        </Show>
        <Show when={appState() == "opening"}>
          <OpenSet />
        </Show>
        <Show when={appState() == "creating"}>
          <CreateSet />
        </Show>
      </FileContext.Provider>
    </StateContext.Provider>
  );
}

render(App);
