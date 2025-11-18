import { useState } from "react"
import HomeScreen from "./components/HomeScreen";
import AudioCallScreen from "./components/AudioCallScreen";
import VideoCallScreen from "./components/VideoCallScreen";
import useSocket from "./hooks/useSocket";
import CallNotification from "./components/CallNotification";
import { useCallState } from "./hooks/useCallState";
import PeerProvider from "./context/PeerContext";

function App() {
  const { userName, setUserName } = useSocket();
  const { showCallNotification, callType, isCallActive } = useCallState()

  const [inputValue, setInputValue] = useState(null);

  return (
    <div className="relative lg:h-screen h-fit flex flex-col bg-[#0a0a0a] text-gray-200 font-inter">

      {/* 🌐 Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-[#111] border-b border-zinc-800 z-10">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2 justify-center">
            <img src="/logo.png" alt="Fling Logo" className="w-6 h-6" />
            <span className="text-green-400 font-semibold text-lg tracking-wide">Fling</span>
          </div>
          {userName && (
            <div className="text-sm text-gray-400">
              👋 {userName}
            </div>
          )}
        </div>
      </nav>

      {/* 🖥️ Main Window */}
      <div className="flex-1 mt-16 flex items-start justify-center p-6 w-full max-w-7xl mx-auto">
        {callType === null && <HomeScreen />}
        <PeerProvider>
          {(callType === "audioCall" && isCallActive) && <AudioCallScreen />}
          {(callType === "videoCall" && isCallActive) && <VideoCallScreen />}
        </PeerProvider>
      </div>

      {showCallNotification && <CallNotification />}

      {/* 🔐 Login Overlay */}
      {!userName && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md">
          <form
            className="bg-[#111] border border-zinc-800 rounded-xl p-8 w-80 space-y-5 shadow-[0_0_30px_rgba(0,255,120,0.15)]"
          >
            <h2 className="text-green-400 font-semibold text-xl text-center">
              Enter Your Name
            </h2>
            <p className="text-sm text-gray-400 text-center">
              So others can find you in the active users list
            </p>
            <input
              type="text"
              name="userName"
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-200"
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g. yash"
            />
            <button
              type="button"
              onClick={() => {
                setUserName(inputValue)
                setInputValue(null)
              }}
              className="w-full py-2 rounded-md bg-green-500 hover:bg-green-400 text-black font-medium transition-all duration-200"
            >
              Continue
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
