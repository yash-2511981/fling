import { useEffect, useRef, useState } from 'react';
import useSocket from '../hooks/useSocket';
import { useCallState } from '../hooks/useCallState';
import { useAfterCallState } from '../hooks/useAfterCallState';
import { IoCall, IoMic, IoMicOff, IoVideocam, IoVideocamOff } from 'react-icons/io5';
import { usePeer } from '../hooks/usePeer';

const VideoCallScreen = () => {
  const { socket, userName } = useSocket();
  const { remoteUser, resetStates, isInitiater } = useCallState();
  const { isCallActive, isMicOn, isCameraOn, setIsMicOn, setIsCameraOn, resetCallState } = useAfterCallState();


  const [isMediaReady, setIsMediaReady] = useState(false);
  const [pendingCandidates, setPendingCandidates] = useState([]);
  const [pendingOffer, setPendingOffer] = useState(null);

  const { peer, sendOffer, sendAnswer, sendStream, setRemoteAns, remoteStream } = usePeer();
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const localRef = useRef(null)

  useEffect(() => {
    if (!socket || !remoteUser || !peer) return;

    const gatherAndSendICE = (event) => {
      if (event.candidate) {
        socket.send(JSON.stringify({
          event: "sendIceCandidate",
          payload: { from: userName, to: remoteUser, candidate: event.candidate }
        }));
      }
    };

    peer.addEventListener('icecandidate', gatherAndSendICE);
    const setupMediaStream = async () => {
      try {
        const constraints = {
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user",
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          }
        };

        localRef.current = await navigator.mediaDevices.getUserMedia(constraints);

        sendStream(localRef.current)
        if (localStreamRef.current) {
          localStreamRef.current.srcObject = localRef.current;
        }

        setTimeout(() => setIsMediaReady(true), 200);

      } catch (err) {
        console.error("Media permission error:", err);
        alert("Failed to access camera/microphone.");
      }
    };

    setupMediaStream();

    return () => {
      if (localRef.current) {
        localRef.current?.getTracks().forEach(track => track.stop());
      }
      peer.removeEventListener('icecandidate', gatherAndSendICE);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, remoteUser, peer, userName]);

  useEffect(() => {
    const processPending = async () => {
      if (peer.remoteDescription && pendingCandidates.length > 0) {
        for (const c of pendingCandidates) {
          try {
            await peer.addIceCandidate(new RTCIceCandidate(c));
          } catch (err) {
            console.error("Error adding pending ICE:", err);
          }
        }
        setPendingCandidates([]);
      }
    };
    processPending();
  }, [peer.remoteDescription, pendingCandidates, peer]);

  useEffect(() => {
    if (isMediaReady && pendingOffer) {
      const process = async () => {
        const answer = await sendAnswer(pendingOffer);
        socket.send(JSON.stringify({
          event: "sendAnswer",
          payload: { from: userName, to: remoteUser, answer }
        }));
        setPendingOffer(null);
      };
      process();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMediaReady, pendingOffer]);

  useEffect(() => {
    if (!socket) return;

    const handleMessages = async (e) => {
      const data = JSON.parse(e.data);

      switch (data.event) {

        case "callAccepted": {
          if (!isInitiater) return;
          const offer = await sendOffer();
          socket.send(JSON.stringify({
            event: "sendOffer",
            payload: { from: userName, to: remoteUser, offer }
          }));
          break;
        }

        case "receiveOffer": {
          if (isInitiater) return;

          const { offer } = data.payload;
          await peer.setRemoteDescription(new RTCSessionDescription(offer));

          if (!isMediaReady) {
            setPendingOffer(offer);
            return;
          }

          const ans = await sendAnswer(offer);
          socket.send(JSON.stringify({
            event: "sendAnswer",
            payload: { from: userName, to: remoteUser, answer: ans }
          }));
          break;
        }

        case "receiveAnswer": {
          if (!isInitiater) return;
          const { answer } = data.payload;
          await setRemoteAns(answer);
          break;
        }

        case "receiveICECandidate": {
          const { iceCandidate } = data.payload;
          if (peer.remoteDescription) {
            await peer.addIceCandidate(new RTCIceCandidate(iceCandidate));
          } else {
            setPendingCandidates(prev => [...prev, iceCandidate]);
          }
          break;
        }

        case "hangUp": {
          callEnded();
          break;
        }
      }
    };

    socket.addEventListener("message", handleMessages);
    return () => socket.removeEventListener("message", handleMessages);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remoteUser, socket, userName, isInitiater, peer, sendOffer, sendAnswer, setRemoteAns]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.play().catch(() => { });
    }
  }, [remoteStream]);

  const toggleMic = () => {
    const audio = localRef.current?.getAudioTracks()[0];
    if (audio) {
      audio.enabled = !audio.enabled;
      setIsMicOn(audio.enabled);
    }
  };

  const toggleVideo = () => {
    const video = localRef.current?.getVideoTracks()[0];
    if (video) {
      video.enabled = !video.enabled;
      setIsCameraOn(video.enabled);
    }
  };

  const callEnded = () => {
    if (localRef.current) {
      localRef.current.getTracks().forEach(track => track.stop());
    }

    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        event: "hangUp",
        payload: { from: userName, to: remoteUser }
      }));
    }

    resetCallState();
    resetStates();
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex-1 relative">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className={`w-full h-full object-cover ${remoteStream ? 'block' : 'hidden'}`}
        />

        {!remoteStream && (
          <div className="absolute inset-0 flex items-center justify-center text-white text-xl">
            <div className="text-center">
              <div className="animate-pulse mb-4">📞</div>
              <p>Connecting...</p>
              {!isMediaReady && <p className="text-sm text-yellow-400 mt-2">Setting up media...</p>}
            </div>
          </div>
        )}

        <div className="absolute bottom-4 right-4 w-32 h-48 z-10 border-2 border-white rounded-lg overflow-hidden shadow-2xl">
          <video
            ref={localStreamRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {!localStreamRef.current && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <p className="text-white text-xs">Loading...</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-800 text-white p-4 flex justify-center gap-8">
        {isCallActive && (
          <>
            <button
              className={`p-3 rounded-full h-12 w-12 flex items-center justify-center transition-colors
                ${isMicOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
              onClick={toggleMic}
              disabled={!localRef.current}
            >
              {isMicOn ? <IoMic className='text-2xl' /> : <IoMicOff className='text-2xl' />}
            </button>

            <button
              className={`p-3 rounded-full h-12 w-12 flex items-center justify-center transition-colors
                ${isCameraOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
              onClick={toggleVideo}
              disabled={!localRef.current}
            >
              {isCameraOn ? <IoVideocam className='text-2xl' /> : <IoVideocamOff className='text-2xl' />}
            </button>
          </>
        )}

        <button
          className="p-3 bg-red-600 hover:bg-red-700 rounded-full h-12 w-12 flex items-center justify-center"
          onClick={callEnded}
        >
          <IoCall className="text-2xl rotate-[135deg]" />
        </button>
      </div>
    </div>
  );
};

export default VideoCallScreen;