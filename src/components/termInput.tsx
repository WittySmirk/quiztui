import BetterInput from "./betterInput";

import type { InputRenderable } from "@opentui/core";
import type { Accessor } from "solid-js";

function TermInput(props: { ref1: (el: InputRenderable) => void, ref2: (el: InputRenderable) => void, i: Accessor<number>, index: number }) {
  return (
    <box flexDirection="row" alignItems="center">
      <BetterInput ref={props.ref1} label="Term:" i={props.i} index={props.index} />
      <BetterInput ref={props.ref2} label="Definition:" i={props.i} index={props.index + 1} />
    </box>
  );
}

export default TermInput;
