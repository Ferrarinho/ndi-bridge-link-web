// Replace this with the URL returned by `wrangler deploy` before publishing.
const SIGNAL_URL = "wss://ndi-bridge-signaling.lucas-marcon2014.workers.dev";
const room = new URLSearchParams(location.search).get("room");
const state = document.querySelector("#state"), video = document.querySelector("#video");
if (!room || SIGNAL_URL.includes("YOUR-WORKER")) state.textContent = "Link ainda não configurado.";
else {
  const socket = new WebSocket(`${SIGNAL_URL}/room/${encodeURIComponent(room)}`);
  const peer = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
  peer.ontrack = event => { video.srcObject = event.streams[0]; state.textContent = "Conectado"; };
  peer.onicecandidate = event => event.candidate && socket.send(JSON.stringify({ ice: event.candidate }));
  socket.onmessage = async event => { const message = JSON.parse(event.data); if (message.offer) { await peer.setRemoteDescription(message.offer); const answer = await peer.createAnswer(); await peer.setLocalDescription(answer); socket.send(JSON.stringify({ answer })); } if (message.answer) await peer.setRemoteDescription(message.answer); if (message.ice) await peer.addIceCandidate(message.ice); };
  socket.onopen = () => state.textContent = "Conectando à transmissão…";
  socket.onerror = () => state.textContent = "Não foi possível conectar ao bridge.";
}

