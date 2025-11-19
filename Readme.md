# 🎯 Fling — Real-Time P2P Video Chat

A lightweight WebRTC + WebSocket application that demonstrates how two browsers connect directly for video calling — **no media server, no database, just peer-to-peer**.

## 💡 What is Fling?

**Fling** is a minimal WebRTC demo that shows how P2P video calling works using a simple WebSocket signaling server.

👉 The signaling server only handles SDP/ICE exchange.  
👉 Once connected, **media flows directly between peers**.

## ✨ Features

- 🎥 Direct peer-to-peer video calling
- 🔌 Lightweight WebSocket signaling
- 🚀 Works in modern browsers — no plugins needed
- ⚡ Low-latency P2P media flow
- 🎓 Great for learning WebRTC basics

## 🚀 Quick Start

### Prerequisites

- Node.js (v14+)
- Modern browser (Chrome, Firefox, Edge, Safari)

### Installation

1. **Clone the repo**

```bash
git clone https://github.com/yash-2511981/fling.git
cd fling
```

2. **Start signaling server**

```bash
cd fling-server
npm install
npm start
```

3. **Start frontend**

```bash
cd fling-client
npm install
npm run dev
```

Open two tabs, enter different usernames, and start a call.

## 🏗️ Architecture

```
User A ◄── WebSocket ──► Signaling Server ──► WebSocket ─► User B
   │                                                          │
   └──────────── WebRTC: Direct P2P Video Stream ────────────┘
```

- **WebSocket** → signaling (offer/answer/ICE)
- **WebRTC** → direct media flow

## 🛠️ Built With

- React + WebRTC
- Node.js + `ws`
- No database — everything runs in memory

## 📖 Detailed Blog

For full explanation (SDP, ICE, React race conditions, signaling flow, backend + frontend walkthrough):

👉 Read the detailed blog: https://yashshetye.hashnode.dev/how-i-built-real-time-video-calls-in-a-mern-chat-app-using-webrtc-websocket

This README stays short. The blog explains everything deeply.

## 🤝 Contributing

Contributions are welcome!

### Ideas:

- 🎧 Audio toggle/mute
- 💬 In-call chat
- 🖥️ Screen sharing
- 🎨 Better UI
- 🔐 Auth
- 📡 Call quality indicators

### Steps:

1. Fork → 2. Branch → 3. Improve → 4. PR

## ⚠️ Note on Scalability

This uses mesh topology, ideal for 1-on-1 calls. Group calls require an SFU/MCU (Zoom/Meet style).

I've explored this in my other project **Baithak**, which uses GetStream's SFU.

## 📚 Resources

- https://webrtc.org
- https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API
- Blog Link → https://yashshetye.hashnode.dev/how-i-built-real-time-video-calls-in-a-mern-chat-app-using-webrtc-websocket

## 👨‍💻 Author

**Yash Shetye**

- GitHub: https://github.com/yash-2511981
- LinkedIn: https://www.linkedin.com/in/yash-shetye-62b58b313/

---

⭐ If this helped you, give the repo a star! Built with curiosity, shared with the community. 🚀
