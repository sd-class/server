const url = "ws://localhost:3000";
let ws = new WebSocket(url);
ws.onopen = async () => {
  console.log("connected");
  for await (const line of console) {
    ws.send(await transform("a/b", line));
  }
  const a = 10;
};
ws.onmessage = (msg) => {
  console.log(msg);
};
ws.onclose = () => {
  console.log("disconnected");
};
ws.onerror = (err) => {
  console.error(err);
};
function transform(
  event: string,
  data: string | ArrayBufferLike | Blob | ArrayBufferView
) {
  if (data instanceof SharedArrayBuffer) data = new Uint8Array(data);
  return new Blob([event, "\0", data]).arrayBuffer();
}
