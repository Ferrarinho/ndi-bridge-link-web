export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/health") return new Response("NDI Bridge signaling online");
    const match = url.pathname.match(/^\/room\/([a-zA-Z0-9_-]{6,64})$/);
    if (!match || request.headers.get("Upgrade") !== "websocket") return new Response("Not found", { status: 404 });
    return env.ROOM.get(env.ROOM.idFromName(match[1])).fetch(request);
  },
};

export class Room {
  constructor(state) { this.state = state; }
  async fetch(request) {
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    server.addEventListener("message", event => {
      // SDP/ICE payloads are relayed to the other participant only.
      for (const socket of this.state.getWebSockets()) {
        if (socket !== server) socket.send(event.data);
      }
    });
    this.state.acceptWebSocket(server);
    return new Response(null, { status: 101, webSocket: client });
  }
}
