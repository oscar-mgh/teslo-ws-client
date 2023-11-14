import { Manager, Socket } from 'socket.io-client';

let socket: Socket;

export const connectToServer = (jwtToken: string) => {
	const manager = new Manager(
		'http://localhost:3000/socket.io/socket.io.js',
		{
			extraHeaders: {
				authentication: jwtToken,
			},
		}
	);
	socket?.removeAllListeners();
	socket = manager.socket('/');
	addListeners(socket);
};

const addListeners = (socket: Socket) => {
	const serverStatusLabel =
		document.querySelector<HTMLHeadElement>('#server-status')!;
	const clientList =
		document.querySelector<HTMLUListElement>('#clients-list')!;
	const messagesList =
		document.querySelector<HTMLUListElement>('#messages-list')!;
	const messageForm =
		document.querySelector<HTMLInputElement>('#message-form')!;
	const messageInput =
		document.querySelector<HTMLInputElement>('#message-input')!;

	messageForm.addEventListener('submit', e => {
		e.preventDefault();
		if (messageInput.value.trim().length <= 0) return;
		socket.emit('message-from-client', { message: messageInput.value });
		messageInput.value = '';
	});

	socket.on('connect', () => {
		if (serverStatusLabel) serverStatusLabel.innerHTML = 'connected';
	});
	socket.on('disconnect', () => {
		if (serverStatusLabel) serverStatusLabel.innerHTML = 'disconnected';
	});
	socket.on('clients-connected', (clients: string[]) => {
		let clientsHtml = '';
		clients.forEach(clientId => {
			clientsHtml += `
					<li> Client: ${clientId}</li>
				`;
		});
		clientList.innerHTML = clientsHtml;
	});
	socket.on(
		'message-from-server',
		(payload: { fullName: string; message: string }) => {
			const newMessage = `
				<li>
					<strong>${payload.fullName}</strong>
					<span>${payload.message}</span>
				</li>
			`;
			const li = document.createElement('li');
			li.innerHTML = newMessage;
			messagesList.append(li);
		}
	);
};
