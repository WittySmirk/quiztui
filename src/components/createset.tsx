import { useKeyboard } from "@opentui/solid";
import { createEffect, createSignal, For, useContext } from "solid-js";
import { FileContext, StateContext } from "../index";

import BetterInput from "./betterInput";
import TermInput from "./termInput";
import type { InputRenderable } from "@opentui/core";

function CreateSet() {
  const [i, setI] = createSignal<number>(0);
  const [terms, setTerms] = createSignal<number[]>([1]);

  const [fileState, setFileState] = useContext(FileContext);
  const [appState, setAppState] = useContext(FileContext);

  let inputs: InputRenderable[] = [];

  createEffect(() => {
    inputs[i()]?.focus();
  });

  useKeyboard(async (key) => {
    if (!key.shift && key.name === "tab") {
      if (i() < inputs.length - 1) {
        setI((n) => n + 1);
      } else {
        setTerms(t => [...t, t[t.length - 1]! + 2]);
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
      await Bun.write("./sets/" + o.title + ".json", j);

      setFileState(o);
      setAppState("main");
    }
  });

  return (
    <box alignItems="center">
      <BetterInput ascii={true} onSubmit={(e) => console.log(e)} label="Title:" ref={(el: InputRenderable) => inputs[0] = el} index={0} i={i} />
      <scrollbox stickyScroll={true} stickyStart="bottom">
        <For each={terms()}>
          {(val) => (<TermInput ref1={(el: InputRenderable) => inputs[val] = el} ref2={(el: InputRenderable) => inputs[val + 1] = el} i={i} index={val} />)}
        </For>
      </scrollbox>
      <box>
        <text>tab next | shift+tab previous | ctrl+s save</text>
      </box>
    </box>
  );
}

export default CreateSet;
