import http from 'http';
import { WebSocketServer } from 'ws';

//create a http server 
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'content-type': 'text/plain' });
    res.end("Connected to WebSocket server");
});

//client socket map to save the socket connection for each user
const clientSocketMap = new Map();

//active clients call map.
const activeCallMap = new Map();

//create a websocket server using the http server.
const wss = new WebSocketServer({ server });

//connect the user to socket server.
wss.on('connection', (ws, req) => {
    const params = new URL(req.url, 'ws://localhost').searchParams;
    const userName = params.get('userName');

    if (!userName) {
        ws.send(JSON.stringify({ event: "error", message: "Username Required" }))
        ws.close()
        return;
    }

    if (clientSocketMap.has(userName)) {
        ws.send(JSON.stringify({ event: "userNameTaken", message: "Username is already taken" }))
        ws.close()
        return;
    }

    clientSocketMap.set(userName, ws);
    ws.userName = userName
    console.log(`${userName || userName} joined`);

    wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === client.OPEN) {
            client.send(JSON.stringify({ event: "newUser", userName }));
        }
    });

    const userNames = Array.from(clientSocketMap.keys())
    ws.send(JSON.stringify({ event: "activeUserData", userNames }))


    //recieving events sent by client
    ws.on('message', (data) => {
        const { event, payload } = JSON.parse(data.toString());
        const { to, from } = payload;
        console.log("Event:", event, "payload", payload);

        const receiver = clientSocketMap.get(to);

        if (!receiver || receiver.readyState !== receiver.OPEN) {
            console.log(`${to} is not connected`);
            return;
        }

        switch (event) {
            case "initiateCall":
                const { offer } = payload;
                receiver.send(JSON.stringify({ event: "incomingCall", payload: { from, to, offer } }))
                break;
            case "callAccepted":
                receiver.send(JSON.stringify({
                    event: "callAccepted",
                    payload: { from, to }
                }))
                activeCallMap.set(from, to)
                activeCallMap.set(to, from)
                console.log("📞 Active Call Map:", Array.from(activeCallMap.entries()));
                break;
            case "callDeclined":
                receiver.send(JSON.stringify({
                    event: "callDeclined",
                    payload: { from, message: "Call declined", to }
                }))
                break;
            case "sendOffer":
                receiver.send(JSON.stringify({
                    event: "receiveOffer",
                    payload: { from, to, offer: payload.offer }
                }))
                break;
            case "sendAnswer":
                receiver.send(JSON.stringify({
                    event: "receiveAnswer",
                    payload: { from, to, answer: payload.answer }
                }))
                activeCallMap.set(from, to)
                activeCallMap.set(to, from)
                break;
            case "sendIceCandidate":
                receiver.send(JSON.stringify({
                    event: "receiveICECandidate",
                    payload: { from, to, iceCandidate: payload.candidate }
                }))
                break;
            case "hangUp":
                receiver.send(JSON.stringify({
                    event: "hangUp",
                    payload: { from, to }
                }))
                activeCallMap.delete(from)
                activeCallMap.delete(to)
                console.log("📞 Active Call Map:", Array.from(activeCallMap.entries()));
                break;
            default:
                console.log("Unknown event:", event);
                break;
        }
    });

    //removing client on closing the connection and cleaning the socketMaps
    ws.on('close', () => {
        const who = ws.userName
        clientSocketMap.delete(who);

        //check that disconnected user was in any active call
        const otherUser = activeCallMap.get(who);
        if (otherUser) {
            const reciever = clientSocketMap.get(otherUser)

            if (reciever && reciever.readyState === reciever.OPEN)
                reciever.send(JSON.stringify({ event: "hangUp", payload: { from: who, to: otherUser } }))

            //clean up the active call map to avoid state entries
            activeCallMap.delete(who);
            activeCallMap.delete(otherUser);
        }

        wss.clients.forEach((ws) => {
            if (ws.userName !== otherUser) {
                ws.send(JSON.stringify({ event: 'removeUser', userName: who }))
            }
        })

        console.log(`${who} disconnected`);
    });

    //error handling while connecting
    ws.on('error', (err) => {
        console.log("⚠️ Error with client:", err.message);
    });
});

server.listen(8080, () => console.log("WebSocket server running on port 8080"));