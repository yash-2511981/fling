import { useAfterCallState } from "../hooks/useAfterCallState"
import { useCallState } from "../hooks/useCallState"
import useSocket from "../hooks/useSocket"

const CallNotification = () => {
    const { callType, remoteUser, setShowCallNotification, resetStates } = useCallState()
    const { setIsCallActive } = useAfterCallState()
    const { socket, userName } = useSocket()

    const onAccept = (e) => {
        e.stopPropagation()
        setIsCallActive(true)
        setShowCallNotification(false)
        socket.send(JSON.stringify({
            event: "callAccepted", payload: { from: userName, to: remoteUser }
        }))
    }

    const onReject = (e) => {
        e.stopPropagation()
        socket.send(JSON.stringify({ event: "callDeclined", payload: { to: remoteUser } }))
        resetStates()
    }

    return (
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 left-4 sm:left-auto z-50 animate-slide-up">
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border-2 border-green-400/30 text-white p-4 sm:p-6 rounded-2xl shadow-2xl backdrop-blur-sm max-w-md">
                {/* Header with pulsing indicator */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="relative">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                            {remoteUser?.charAt(0).toUpperCase()}
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full"></div>
                    </div>

                    <div className="flex-1">
                        <p className="font-bold text-base sm:text-lg text-white">{remoteUser}</p>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                            {callType === "videoCall" ? (
                                <>
                                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    <span>Incoming video call...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span>Incoming audio call...</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Animated wave effect */}
                <div className="flex justify-center gap-1 mb-4 h-8">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="w-1 bg-green-400 rounded-full animate-pulse"
                            style={{
                                animationDelay: `${i * 0.1}s`,
                                height: `${20 + Math.random() * 20}px`
                            }}
                        ></div>
                    ))}
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                    <button
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg"
                        onClick={onReject}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="hidden sm:inline">Decline</span>
                    </button>
                    <button
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-4 rounded-xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg"
                        onClick={onAccept}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="hidden sm:inline">Accept</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CallNotification