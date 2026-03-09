import { FrameBufferRenderable, RGBA } from "@opentui/core";
import { useRenderer, useTerminalDimensions, useKeyboard } from "@opentui/solid";
import { useContext, createSignal, onMount, createEffect } from "solid-js";

import { FileContext } from "../index"

const WHITE = RGBA.fromHex("#FFFFFF");
const YELLOW = RGBA.fromHex("#FFEE8C");

type Term = [[{ key: string, val: string, x: number, y: number }, { key: string, val: string, x: number, y: number }]] | [];
type termType = "term" | "definition";

function Match() {
  const [terms, setTerms] = createSignal<Term>([]);
  const [currentIn, setCurrentIn] = createSignal<string>("");
  const [prevIn, setPrevIn] = createSignal<{ index: number, type: termType } | undefined>(undefined);

  //const [appState, setAppState] = useContext(StateContext);
  const [fileState, setFileState] = useContext(FileContext);
  const renderer = useRenderer();
  const dimensions = useTerminalDimensions();
  const canvas = new FrameBufferRenderable(renderer, {
    id: "canvas",
    width: dimensions().width,
    height: dimensions().height,
    position: "absolute",
    left: 0,
    top: 0,
  });

  onMount(() => {
    let used: Map<string, number> = new Map(); // Map of previously used substrings
    fileState().cards.map((c: [string, string], i: number) => {
      // Find minimum unused substring of term and definition
      let j = 1;
      while (used.get(c[0].slice(0, j)) != undefined) {
        j++;
      }
      let k = 1;
      while (used.get(c[1].slice(0, k)) != undefined) {
        k++;
      }

      used.set(c[0].slice(0, j), 1);
      used.set(c[1].slice(0, k), 1);

      const t = { key: c[0].slice(0, j), val: c[0], x: Math.random() * dimensions().width, y: Math.random() * (dimensions().height - 1) };
      const d = { key: c[1].slice(0, k), val: c[1], x: Math.random() * dimensions().width, y: Math.random() * (dimensions().height - 1) };
      if (i == 0) {
        setTerms([[t, d]]);
      } else {
        setTerms(te => [...te, [t, d]]); // TODO: Fix this type error
      }
    });
  });

  useKeyboard((key) => {
    const reg = /^\b[a-z0-9 ]\b/; // is a-z 0-9 " "
    if (reg.test(key.name)) {
      console.log(key.name);
      setCurrentIn(c => c + key.name);
    }
    if (key.name === "return") {
      if (prevIn() === undefined) {
        terms().map((t, i) => {
          if (currentIn() === t[0].key) {
            setPrevIn({ index: i, type: "term" });
          } else if (currentIn() === t[1].key) {
            setPrevIn({ index: i, type: "definition" });
          } else {
            setCurrentIn("");
          }
        });
      } else {
        console.log("we getting here");
        if (prevIn()?.type === "term") {
          if (currentIn() === terms()[prevIn()?.index][1].key) {
            console.log("match")
          }
        } else {
          if (currentIn() === terms()[prevIn()?.index][0].key) {
            console.log("match")
          }
        }
      }
    }
  });

  createEffect(() => {
    console.log(terms());
    terms().map((t: [{ key: string, val: string, x: number, y: number }, { key: string, val: string, x: number, y: number }]) => {
      canvas.frameBuffer.drawText(t[0].key, t[0].x, t[0].y, YELLOW);
      canvas.frameBuffer.drawText(t[0].val, t[0].x, t[0].y + 1, WHITE);
      canvas.frameBuffer.drawText(t[1].key, t[1].x, t[1].y, YELLOW);
      canvas.frameBuffer.drawText(t[1].val, t[1].x, t[1].y + 1, WHITE);
    });
  });

  return canvas;
}

export default Match;
