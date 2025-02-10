import type { MyWebSocketEventHandler } from "../../types";

export default {
  message(ws, message) {
    console.log("c/d reply", message);
  },
} as MyWebSocketEventHandler<unknown>;
