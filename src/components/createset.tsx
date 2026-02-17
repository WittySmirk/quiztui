import { useKeyboard } from "@opentui/solid";
import { createEffect, createSignal, For } from "solid-js";

import BetterInput from "./betterInput";
import type { InputRenderable } from "@opentui/core";

function CreateSet() {
  const [i, setI] = createSignal<number>(0);
  let inputs: InputRenderable[] = [];

  createEffect(() => {
    inputs[i()]?.focus();
  });

  useKeyboard((key) => {
    if (!key.shift && key.name === "tab") {
      if (i() < inputs.length - 1) {
        setI((n) => n + 1);
      } else {
        inputs.push(<input ref={inputs[i() + 1]} />);
      }
    }

    if (key.shift && key.name === "tab") {
      if (i() > 0) {
        setI((n) => n - 1);
      }
    }
  });

  return (
    <>
      <BetterInput ascii={true} onSubmit={(e) => console.log(e)} />

      {/*<For each={inputs}>
        {(_, index) => (
        )}
      </For>*/}
      {/*   <input ref={inputs[0]} onSubmit={(i) => console.log(i.toString())} />
      <input ref={inputs[1]} onSubmit={(i) => console.log(i.toString())} />
      */}
    </>
  );
}

export default CreateSet;
