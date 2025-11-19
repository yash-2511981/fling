import {  useEffect, useMemo, useState } from "react"
import { PeerContext } from "../hooks/usePeer"

const PeerProvider = ({ children }) => {
    const [remoteStream, setRemoteStream] = useState(null);

    const peer = useMemo(() => {
        const peerConnection = new RTCPeerConnection({
            iceServers: [
                {
                    urls: [
                        "stun:stun.l.google.com:19302",
                        "stun:global.stun.twilio.com:3478"
                    ]
                }
            ]
        });

        peerConnection.ontrack = (ev) => {
            console.log("Remote track received")
            if (ev.streams && ev.streams[0]) {
                setRemoteStream(ev.streams[0])
            }
        }

        console.log("🔌 Peer connection created");

        return peerConnection;
    }, []);

    const sendOffer = async () => {
        try {
            const offer = await peer.createOffer();
            await peer.setLocalDescription(new RTCSessionDescription(offer));
            console.log("📤 Offer created and set as local description");
            return offer;
        } catch (error) {
            console.error("❌ Error creating offer:", error);
            throw error;
        }
    }

    const sendAnswer = async (offer) => {
        try {
            await peer.setRemoteDescription(new RTCSessionDescription(offer));
            const ans = await peer.createAnswer();
            await peer.setLocalDescription(new RTCSessionDescription(ans));
            console.log("📤 Answer created and set as local description");
            return ans;
        } catch (error) {
            console.error("❌ Error creating answer:", error);
            throw error;
        }
    }

    const setRemoteAns = async (ans) => {
        try {
            await peer.setRemoteDescription(new RTCSessionDescription(ans));
            console.log("✅ Remote answer set successfully");
        } catch (error) {
            console.error("❌ Error setting remote answer:", error);
            throw error;
        }
    }

    const sendStream = (stream) => {
        try {
            console.log("📡 Adding stream tracks to peer connection");
            const tracks = stream.getTracks();
            for (const track of tracks) {
                peer.addTrack(track, stream);
                console.log(`✅ Added ${track.kind} track`);
            }
        } catch (error) {
            console.error("❌ Error adding stream:", error);
            throw error;
        }
    }

    const addIceCandidate = async (candidate) => {
        await peer.addIceCandidate(candidate)
    }


    // Cleanup on unmount
    useEffect(() => {
        return () => {
            console.log("🧹 Cleaning up peer connection");
            peer.close();
        };
    }, [peer]);

    return (
        <PeerContext.Provider value={{
            peer,
            sendOffer,
            sendAnswer,
            sendStream,
            setRemoteAns,
            remoteStream,
            addIceCandidate
        }}>
            {children}
        </PeerContext.Provider>
    )
}

export default PeerProvider