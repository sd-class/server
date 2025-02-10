import type { MyWebSocketEventHandler } from "../../types";

export default {
  message(ws, message) {
    const msg = new TextDecoder().decode(message);
    console.log("a/b reply", msg);
  },
} as MyWebSocketEventHandler<unknown>;
