import { useKeyboard } from "@opentui/solid";
import { createSignal, onMount, For, Show, useContext } from "solid-js";
import { readdir } from "node:fs/promises"
import { FileContext, StateContext } from "../index";


function OpenSet() {
  const [files, setFiles] = createSignal<string[]>([""]);
  const [i, setI] = createSignal<number>(0);
  const [renaming, setRenaming] = createSignal<boolean>(false);
  //const renderer = useRenderer();
  const [fileState, setFileState] = useContext(FileContext);
  const [appState, setAppState] = useContext(StateContext);

  onMount(async () => {
    //renderer.console.show();
    const fs = await readdir("./sets");
    if (fs.length == 0) {
      setAppState("creating");
    }
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
      //console.log(files()[i()]);
      if (renaming()) {
        return;
      }
      const f = Bun.file("sets/" + files()[i()]);
      const j = await f.json();
      setFileState(j);
      setAppState("main");
    }
    if (key.shift && key.name === "d") {
      await Bun.file("sets/" + files()[i()]).delete();
      const fs = await readdir("./sets");
      setFiles(fs);
    }
    if (key.shift && key.name === "r") {
      if (!renaming()) {
        setRenaming(true);
      }
    }
  });

  return (
    <>
      <text>enter open current | D delete current | R rename current</text>
      <For each={files()}>
        {(file, index) => (
          <Show when={i() == index()} fallback={<text>{file}</text>}>
            <Show when={renaming()} fallback={
              <text fg="#FFEE8C"><strong>{"> " + file}</strong></text>
            }>
              <input textColor="#FFEE8C" focused={true} value={file}></input>
            </Show>
          </Show>
        )}
      </For >
    </>
  );
}

export default OpenSet;
