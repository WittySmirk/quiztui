import { useKeyboard, useRenderer, useTerminalDimensions } from "@opentui/solid";
import { createSignal, onMount, useContext } from "solid-js";
import { FileContext } from "../index";

function MainSet() {
  const [title, setTitle] = createSignal<string>("")
  const [cards, setCards] = createSignal<string[]>([""]);
  const renderer = useRenderer();
  const [cardsi, setCardsi] = createSignal<number>(0);
  const [cardi, setCardi] = createSignal<number>(0);
  const dimensions = useTerminalDimensions();
  const [fileState, setFileState] = useContext(FileContext);

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
    // Debug only
    if (key.name === "r") {
      const f = Bun.file("test.json")
      const j = await f.json();
      setTitle(j.title)
      setCards(j.cards)
    }
  })
  return (
    <box alignItems="center" justifyContent="center" flexGrow={1} >
      <ascii_font text={title()} />
      <box width={dimensions().width * 0.5} height={dimensions().height * 0.5} justifyContent="center" alignItems="center" border={true}>
        <ascii_font text={cards()[cardsi()]![cardi()]} />
      </box>
      <box>
        <text>h previous | l next | space flip</text>
      </box>
    </box >
  );
}

export default MainSet;
