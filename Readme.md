# 🎯 Fling - Real-Time P2P Video Chat

A lightweight WebRTC + WebSocket application that demonstrates how browsers can talk directly to each other for video/audio calls — **no database, no media server, just pure peer-to-peer magic**.

## 💡 What is Fling?

**Fling** is a minimal real-time video calling app built to help developers understand how WebRTC and WebSocket work together. It shows the core concept: **two users connecting directly** through their browsers, with a signaling server only handling the handshake.

**Key Idea**: Once connected, your video and audio flow **directly** between peers, not through any central server.

## ✨ Features

- 🎥 Direct peer-to-peer video/audio streaming
- 🔌 WebSocket-based signaling (no database required)
- 🚀 Zero plugins — works in modern browsers
- ⚡ Low latency direct connections
- 🎓 Educational — learn WebRTC fundamentals

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

2. **Start Signaling Server**
```bash
cd fling-server
npm install
npm start
```
Server runs on `ws://localhost:8080`

3. **Start Frontend**
```bash
cd fling-client
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

4. **Test It Out**
   - Open two browser tabs
   - Enter different usernames
   - Click "Call" to connect

## 🏗️ Architecture

```
User 1 ◄──(WebSocket)──► Signaling Server ◄──(WebSocket)──► User 2
   │                                                            │
   └────────────────(WebRTC - Direct P2P)─────────────────────┘
```

**The Flow:**
1. Users connect to WebSocket server and exchange signaling data (SDP, ICE)
2. WebRTC establishes a direct connection between browsers
3. Video/audio streams directly peer-to-peer (server is out of the picture)

## 🛠️ Built With

- **Frontend**: React + WebRTC API
- **Signaling**: Node.js + `ws` library
- **No Database** — everything happens in real-time memory

## 📖 Learn More

Want to understand how this works under the hood? Check out the **[detailed blog post](your-blog-link-here)** where I break down:
- WebRTC connection flow
- Signaling server implementation
- SDP offer/answer exchange
- ICE candidate gathering
- Complete code walkthrough

## 🤝 Contributing

This is an **open learning project**! Contributions, improvements, and creative enhancements are welcome.

### Ideas to Enhance:
- 💬 Add text chat during calls
- 🖥️ Implement screen sharing
- 🎨 Improve UI/UX
- 📝 Add call notifications
- 🔐 User authentication
- 📊 Connection quality indicators

**How to contribute:**
1. Fork the repo
2. Create a feature branch
3. Make your improvements
4. Submit a pull request

## ⚠️ Important Note

This uses **mesh topology** (direct P2P), perfect for **1-on-1 calls** but doesn't scale for group calls. For group calls, you'd need SFU/MCU architecture (like Zoom uses).

## 📚 Resources

- [WebRTC Documentation](https://webrtc.org/)
- [MDN WebRTC Guide](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [Full Blog Post](your-blog-link-here)

## 📄 License

MIT License — Free to use, modify, and learn from!

## 👨‍💻 Author

**Yash Shetye**

- GitHub: [@yash-2511981](https://github.com/yash-2511981)
- LinkedIn: [Yash Shetye](https://www.linkedin.com/in/yash-shetye-62b58b313/)

---

⭐ **Found this helpful?** Give it a star and share it with others learning WebRTC!

**Built with curiosity, shared with the community. Happy coding! 🚀**