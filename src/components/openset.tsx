import { useKeyboard } from "@opentui/solid";
import { createSignal, onMount, For, Show, useContext } from "solid-js";
import { readdir } from "node:fs/promises"
import { FileContext, StateContext } from "../index";

function OpenSet() {
  const [files, setFiles] = createSignal<string[]>([""]);
  const [i, setI] = createSignal<number>(0);
  //const renderer = useRenderer();
  const [fileState, setFileState] = useContext(FileContext);
  const [appState, setAppState] = useContext(StateContext);

  onMount(async () => {
    //renderer.console.show();
    const fs = await readdir("./sets");
    setFiles(fs);
  });

  useKeyboard(async (key) => {
    if (key.name === "j") {
      if (i() < files().length - 1) {
        setI((i) => i + 1);
      }
    }
    if (key.name === "k") {
      if (i() > 0) {
        setI((i) => i - 1);
      }
    }
    if (key.name === "return") {
      console.log(files()[i()]);
      const f = Bun.file("sets/" + files()[i()]);
      const j = await f.json();
      setFileState(j);
      setAppState("main");
    }
  });

  return (
    <>
      <For each={files()}>
        {(file, index) => (
          <Show when={i() == index()} fallback={<text>{file}</text>}>
            <text fg="#FFEE8C"><strong>{"> " + file}</strong></text>
          </Show>
        )}
      </For >
    </>
  );
}

export default OpenSet;
