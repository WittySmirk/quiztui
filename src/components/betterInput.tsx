import { useKeyboard } from "@opentui/solid";
import { createSignal, createEffect, Show } from "solid-js";

import type { InputRenderable, SubmitEvent } from "@opentui/core";

function BetterInput(props: { ascii?: boolean, onSubmit?: (event: SubmitEvent) => void }) {
  const [value, setValue] = createSignal<string>("");
  const [focused, setFocused] = createSignal<boolean>(true);

  let input!: InputRenderable;

  createEffect(() => {
    if (focused()) {
      input.focus();
    }
  });

  return (
    <>
      <input ref={input} visible={false} onInput={(v) => setValue(v)} onSubmit={props.onSubmit} />
      <box>
        <Show when={props.ascii == true} fallback={<text>{value()}</text>
        }>
          <ascii_font text={value()} />
        </Show>
      </box>
    </>
  );
}

export default BetterInput;
