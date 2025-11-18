import { useCallback, useEffect, useMemo, useState } from "react"
import { PeerContext } from "../hooks/usePeer"

const PeerProvider = ({ children }) => {


    const [remoteStream, setRemoteStream] = useState(null);

    const peer = useMemo(() => new RTCPeerConnection({
        iceServers: [
            {
                urls:
                    [
                        "stun:stun.l.google.com:18302",
                        "stun:global.stun.twilio.com:3478"
                    ]
            }
        ]
    }), [])

    const createOffer = async () => {
        const offer = await peer.createOffer()
        peer.localDescription(new RTCSessionDescription(offer))
        return offer
    }

    const sendAnswer = async (offer) => {
        await peer.setRemoteDescription(new RTCSessionDescription(offer))
        const ans = await peer.sendAnswer()
        await peer.setLocalDescription(new RTCSessionDescription(ans))
        return ans
    }

    const setRemoteAns = async (ans) => {
        await peer.setRemoteDescription(ans)
    }

    const sendStream = (stream) => {
        const tracks = stream.getTracks()
        for (const track of tracks) {
            peer.addTrack(track, stream)
        }
    }

    const handleMediaStreaming = useCallback((ev) => {
        const streams = ev.streams
        setRemoteStream(streams[0])
    }, [setRemoteStream])

    useEffect(() => {
        peer.addEventListener('track', handleMediaStreaming)
        return () => {
            peer.removeEventListener('track', handleMediaStreaming)
        }
    }, [peer, handleMediaStreaming])

    return (
        <PeerContext.Provider value={{ peer, createOffer, sendAnswer, sendStream, setRemoteAns, remoteStream }} >
            {children}
        </PeerContext.Provider>
    )
}

export default PeerProvider