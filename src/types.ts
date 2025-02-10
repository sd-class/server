import type { ServerWebSocket } from "bun";

export interface MyWebSocketEventHandler<T> {
  message(ws: ServerWebSocket<T>, message: Buffer): void | Promise<void>;
  open?(ws: ServerWebSocket<T>): void | Promise<void>;
  close?(
    ws: ServerWebSocket<T>,
    code: number,
    reason: string
  ): void | Promise<void>;
}
