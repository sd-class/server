import type { MyWebSocketEventHandler } from "../../types";

export default {
  message(ws, message) {
    console.log("b/c reply", message);
  },
} as MyWebSocketEventHandler<unknown>;
