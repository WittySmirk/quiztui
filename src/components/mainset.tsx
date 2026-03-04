import { useKeyboard, useRenderer, useTerminalDimensions } from "@opentui/solid";
import { createSignal, onMount, useContext, Show } from "solid-js";
import { StateContext, FileContext } from "../index";

import Match from "./match"

type mode = "flashcard" | "match" | "gravity";

function MainSet() {
  const [title, setTitle] = createSignal<string>("")
  const [cards, setCards] = createSignal<string[]>([""]);
  const [cardsi, setCardsi] = createSignal<number>(0);
  const [cardi, setCardi] = createSignal<number>(0);
  const [mode, setMode] = createSignal<mode>("flashcard");
  const [appState, setAppState] = useContext(StateContext);
  const [fileState, setFileState] = useContext(FileContext);

  const renderer = useRenderer();
  const dimensions = useTerminalDimensions();

  onMount(async () => {
    setTitle(fileState().title)
    setCards(fileState().cards)
  })

  useKeyboard(async (key) => {
    if (key.name === "space") {
      if (cardi() == 0) {
        setCardi(1);
      } else {
        setCardi(0);
      }
    }
    if (key.name === "l") {
      if (cardsi() < cards().length - 1) {
        setCardsi((c) => c + 1)
      }
      setCardi(0)
    }
    if (key.name === "h") {
      if (cardsi() > 0) {
        setCardsi((c) => c - 1)
      }
      setCardi(0)
    }
    if (key.name === "c") {
      renderer.console.toggle();
    }
    if (key.name === "m") {
      setMode("match");
    }
    if (key.name === "g") {
      setMode("gravity");
    }
    // Debug only
    if (key.name === "r") {
      const f = Bun.file("test.json")
      const j = await f.json();
      setTitle(j.title)
      setCards(j.cards)
    }
    if (key.shift && key.name == "e") {
      setAppState("editing");
    }
  })
  return (
    <box alignItems="center" justifyContent="center" flexGrow={1} >
      <Show when={mode() == "flashcard"}>
        <ascii_font text={title()} />
        <box width={dimensions().width * 0.5} height={dimensions().height * 0.5} justifyContent="center" alignItems="center" border={true}>
          <ascii_font text={cards()[cardsi()]![cardi()]} />
        </box>
        <box>
          <text>h previous | l next | space flip | E edit set | m match mode | g gravity mode</text>
        </box>
      </Show>
      <Show when={mode() == "match"}>
        <Match />
      </Show>
      <Show when={mode() == "gravity"}>
        <text>gravity</text>
      </Show>
    </box >
  );
}

export default MainSet;
