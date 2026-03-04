import { useKeyboard } from "@opentui/solid";
import { createEffect, createSignal, For, useContext, onMount, Show } from "solid-js";
import { FileContext, StateContext } from "../index";

import BetterInput from "./betterInput";
import TermInput from "./termInput";
import type { InputRenderable } from "@opentui/core";

function CreateSet(props: { edit: boolean }) {
  const [i, setI] = createSignal<number>(0);
  const [terms, setTerms] = createSignal<{ n: number, d: [string, string] }[] | []>([{ n: 1, d: ["", ""] }]);

  const [fileState, setFileState] = useContext(FileContext);
  const [appState, setAppState] = useContext(StateContext);

  let inputs: InputRenderable[] = [];

  onMount(() => {
    if (props.edit) {
      console.log(fileState())
      inputs[0]!.value = fileState().title;

      setTerms([]);
      fileState().cards.map((c: [string, string], i) => {
        if (i == 0) {
          setTerms([{ n: 1, d: c }]);
        }
        setTerms(t => [...t, { n: t[t.length - 1]!.n + 2, d: c }]);
      });
    }
  });

  createEffect(() => {
    inputs[i()]?.focus();
    console.log(terms())
  });

  useKeyboard(async (key) => {
    if (!key.shift && key.name === "tab") {
      if (i() < inputs.length - 1) {
        setI((n) => n + 1);
      } else {
        setTerms(t => [...t, { n: t[t.length - 1]!.n + 2, d: ["", ""] }]);
        setI((n) => n + 1);
      }
    }

    if (key.shift && key.name === "tab") {
      if (i() > 0) {
        setI((n) => n - 1);
      }
    }

    if (key.ctrl && key.name === "s") {
      let o: {
        title: string, cards: [[string, string]]
      } = {
        title: inputs[0]?.value!,
        cards: [["", ""]],
      };

      for (let i = 1; i < inputs.length - 1; i += 2) {
        if (inputs[i]?.value == "" && inputs[i + 1]?.value == "") {
          continue;
        }
        if (i == 1) {
          o.cards[0] = [inputs[i]?.value!, inputs[i + 1]?.value!];
          continue;
        }
        o.cards.push([inputs[i]?.value!, inputs[i + 1]?.value!]);
      }
      console.log(o);
      const j = JSON.stringify(o);

      if (props.edit && o.title != fileState().title) {
        const f = Bun.file("./sets/" + fileState().title + ".json");
        await f.delete();
      }
      await Bun.write("./sets/" + o.title + ".json", j);

      setFileState(o);
      setAppState("main");
    }
  });

  return (
    <box alignItems="center">
      <BetterInput default="" ascii={true} onSubmit={(e) => console.log(e)} label="Title:" ref={(el: InputRenderable) => inputs[0] = el} index={0} i={i} />
      <scrollbox stickyScroll={true} stickyStart="bottom">
        <For each={terms()}>
          {(val, index) => (<TermInput default={terms()[index()]!.d} ref1={(el: InputRenderable) => inputs[val.n] = el} ref2={(el: InputRenderable) => inputs[val.n + 1] = el} i={i} index={val.n} />)}
        </For>
      </scrollbox>
      <box>
        <text>tab next | shift+tab previous | ctrl+s save</text>
      </box>
    </box >
  );
}

export default CreateSet;
