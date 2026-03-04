import BetterInput from "./betterInput";

import type { InputRenderable } from "@opentui/core";
import type { Accessor } from "solid-js";

function TermInput(props: { ref1: (el: InputRenderable) => void, ref2: (el: InputRenderable) => void, i: Accessor<number>, index: number, default: [string, string] }) {
  return (
    <box flexDirection="row" alignItems="center">
      <BetterInput default={props.default[0]} ref={props.ref1} label="Term:" i={props.i} index={props.index} />
      <BetterInput default={props.default[1]} ref={props.ref2} label="Definition:" i={props.i} index={props.index + 1} />
    </box>
  );
}

export default TermInput;
