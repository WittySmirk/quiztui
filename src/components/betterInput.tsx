import { useKeyboard } from "@opentui/solid";
import { createSignal, createEffect, Show } from "solid-js";

import type { Accessor } from "solid-js";
import type { InputRenderable, SubmitEvent, InputRenderableEvents } from "@opentui/core";

function BetterInput(props: { ascii?: boolean, onSubmit?: (event: SubmitEvent) => void, label?: string, ref: (el: InputRenderable) => void, index: number, i: Accessor<number> }) {
  const [value, setValue] = createSignal<string>("");
  return (
    <>
      <input ref={props.ref} visible={false} onInput={(v) => setValue(v)} onSubmit={props.onSubmit} />
      <box flexDirection="row" alignItems="center">
        <Show when={props.label}>
          <Show when={props.ascii} fallback={<text>{props.label + " "}</text>}>
            <ascii_font text={props.label + " "} />
          </Show>
        </Show>
        <box alignItems="center" justifyContent="center" border={true} borderColor={(props.i() == props.index) ? "#FFEE8C" : "white"}>
          <Show when={props.ascii} fallback={<text fg={(props.i() == props.index) ? "#FFEE8C" : "white"}>{value()}</text>
          }>
            <ascii_font color={(props.i() == props.index) ? "#FFEE8C" : "white"} text={value()} />
          </Show>
        </box>
      </box>
    </>
  );
}

export default BetterInput;
