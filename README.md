# Hangout Chat 💬

A real-time group chat app. Open it in two browser tabs (or on two computers on the same network), type a message in one, and it appears instantly in the other.

## How it works

```
Browser A ──┐                         ┌── Browser B
            │   WebSocket messages    │
            └──►  Node.js server  ◄───┘
                (Express + ws, port 3001)
```

- **Frontend** (`frontend/`): a Next.js + React page. It opens a WebSocket connection, shows the connection status, lists messages with timestamps, and sends with the Send button or Enter.
- **Backend** (`backend/`): a Node.js server using Express and the `ws` library. It keeps a list of connected clients and **broadcasts** each message to everyone except the sender. Disconnected clients are removed.

## Run it locally

You need Node.js 18 or newer. Use two terminals.

```bash
# Terminal 1: the chat server
cd backend
npm install
npm start          # WebSocket server on ws://localhost:3001

# Terminal 2: the web app
cd frontend
npm install
npm run dev        # open http://localhost:3000
```

Open http://localhost:3000 in two tabs and start chatting.

## Built with

Next.js · React (hooks: `useState`, `useEffect`, `useRef`) · Node.js · Express · WebSockets (`ws`)

## Next steps

- Usernames and avatars
- Chat rooms
- Saving message history in a database
