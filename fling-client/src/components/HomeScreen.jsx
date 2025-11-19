import { useAfterCallState } from "../hooks/useAfterCallState";
import { useCallState } from "../hooks/useCallState";
import useSocket from "../hooks/useSocket";

const HomeScreen = () => {
    const { setIsInitiater, setRemoteUser } = useCallState()
    const { setIsCallActive } = useAfterCallState()
    const { socket, userName, users } = useSocket()


    const initiateCall = (to) => {
        setRemoteUser(to)
        setIsInitiater(true)
        setIsCallActive(true)
        socket.send(JSON.stringify({
            event: "initiateCall",
            payload: { from: userName, to }
        }));
    }

    return (
        <div className="flex flex-col lg:flex-row w-full gap-4 sm:gap-6 p-4 sm:p-6 lg:p-8 min-h-screen lg:min-h-0">
            {/* Left Side - Welcome & Info */}
            <div className="flex-1 flex flex-col justify-center space-y-4 sm:space-y-6">
                <div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-400 mb-2">
                        Welcome, {userName || 'Guest'}! 👋
                    </h1>
                    <p className="text-gray-400 text-base sm:text-lg">
                        Ready to connect with someone?
                    </p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6 space-y-4">
                    <h2 className="text-lg sm:text-xl font-semibold text-green-400 flex items-center gap-2">
                        <span>💡</span> What is Fling?
                    </h2>
                    <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                        Fling is a <span className="text-green-400 font-medium">learning project</span> built to help beginners understand how real-time <span className="text-green-400 font-medium">audio/video calling</span> works using <span className="text-green-400 font-medium">WebRTC</span> and <span className="text-green-400 font-medium">WebSocket</span>.
                    </p>

                    <div className="space-y-3 text-gray-300">
                        <h3 className="font-semibold text-white text-sm sm:text-base">What you can do:</h3>
                        <ul className="space-y-2 text-xs sm:text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-green-400 flex-shrink-0">✓</span>
                                <span>Set your name to identify yourself</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-400 flex-shrink-0">✓</span>
                                <span>See all currently online users in real-time</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-400 flex-shrink-0">✓</span>
                                <span>Connect via video or audio call with anyone</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-400 flex-shrink-0">✓</span>
                                <span>Experience peer-to-peer connection directly</span>
                            </li>
                        </ul>
                    </div>

                    <div className="pt-3 border-t border-zinc-800">
                        <p className="text-xs text-gray-500">
                            <span className="text-yellow-400">⚡</span> No database, no media server — just pure P2P magic!
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Active Users */}
            <div className="w-full lg:w-96 flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6 max-h-[500px] lg:h-[450px]">
                <div className="mb-4">
                    <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        Online Users
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        {users.length - 1} {users.length === 1 ? 'person' : 'people'} available
                    </p>
                </div>

                {users.length === 1 ? (
                    <div className="flex flex-col items-center justify-center text-center space-y-3 flex-1">
                        <div className="text-5xl sm:text-6xl">😔</div>
                        <p className="text-gray-400 text-sm sm:text-base">No one's online right now</p>
                        <p className="text-xs sm:text-sm text-gray-500">Try again later!</p>
                    </div>
                ) : (
                    <ul className="space-y-3 overflow-y-auto hide-scrollbar">
                        {users.map((u, i) => {
                            if (u === userName) return null;

                            return (
                                <li
                                    key={i}
                                    className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 sm:p-4 hover:border-green-400/50 transition-all"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
                                                {u.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-white font-medium text-sm sm:text-base truncate">{u}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                initiateCall(u)
                                            }}
                                            className="flex-1 p-2 bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm rounded-lg font-medium transition-all flex items-center justify-center gap-1"
                                        >
                                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            <span className="hidden sm:inline">Audio</span>
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                initiateCall(u)
                                            }}
                                            className="flex-1 p-2 bg-green-500 hover:bg-green-600 text-white text-xs sm:text-sm rounded-lg font-medium transition-all flex items-center justify-center gap-1"
                                        >
                                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                            <span className="hidden sm:inline">Video</span>
                                        </button>
                                    </div>
                                </li>
                            )
                        })
                        }
                    </ul>
                )}
            </div>
        </div>
    );
};

export default HomeScreen;