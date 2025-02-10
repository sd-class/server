const url = "ws://localhost:3000";
let ws = new WebSocket(url);
ws.onopen = async () => {
  console.log("connected");
  for await (const line of console) {
    ws.send(line);
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
