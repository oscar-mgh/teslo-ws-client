import './style.css';
import { connectToServer } from './socket-client.ts';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>WebSocket Client</h1>

      <input type="text" id="jwt-token" placeholder="Json Web Token" /> <br />
      <button style="margin: 10px;" id="connect-btn">Connect</button>

    <h2 id="server-status">offline</h2>

    <ul id="clients-list"></ul>
    <form id="message-form">
      <input type="text" placeholder="message" id="message-input"/>
    </form>

    <h3>Messages</h3>
    <ul id="messages-list"></ul>
  </div>
`;

const jwtToken = document.querySelector<HTMLInputElement>('#jwt-token')!;
const connectBtn = document.querySelector<HTMLButtonElement>('#connect-btn')!;

connectBtn.addEventListener('click', _ => {
	if (jwtToken!.value.trim().length !== 187) return alert('enter a valid JWT');

	connectToServer(jwtToken!.value.trim());
});
