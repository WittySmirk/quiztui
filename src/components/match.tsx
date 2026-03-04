import { FrameBufferRenderable, RGBA } from "@opentui/core";
import { useRenderer, useTerminalDimensions } from "@opentui/solid";
import { useContext } from "solid-js";

import { FileContext } from "../index"
function Match() {
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

  //canvas.frameBuffer.fillRect(0, 0, dimensions().width, dimensions().height, RGBA.fromHex("#FF0000"))
  canvas.frameBuffer.drawText("Custom Graphics", 12, 7, RGBA.fromHex("#FFFFFF"))
  console.log(fileState().cards);
  fileState().cards.map((c) => {
    canvas.frameBuffer.drawText(c[0], Math.random() * dimensions().width, Math.random() * dimensions().height, RGBA.fromHex("#FFFFFF"))
    canvas.frameBuffer.drawText(c[1], Math.random() * dimensions().width, Math.random() * dimensions().height, RGBA.fromHex("#FFFFFF"))
  });

  return canvas;
}

export default Match;
