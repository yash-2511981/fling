import { useEffect, useState } from 'react';
import useSocket from '../hooks/useSocket';
import { useCallState } from '../hooks/useCallState';
import { useAfterCallState } from '../hooks/useAfterCallState';
import { IoCall, IoMic, IoMicOff, IoVideocam, IoVideocamOff } from 'react-icons/io5';
import { usePeer } from '../hooks/usePeer';


const VideoCallScreen = () => {
  const { socket, userName } = useSocket();
  const { remoteUser, resetStates, isInitiater } = useCallState();
  const { isCallActive, isMicOn, isCameraOn, setIsCallActive, setIsMicOn, setIsCameraOn } = useAfterCallState();

  const [localStream, setLocalStream] = useState(null);

  const { createOffer, sendAnswer, sendStream, setRemoteAns, remoteStream } = usePeer()

  useEffect(() => {
    const handleConnectionMessages = async (e) => {
      const data = JSON.parse(e.data);
      const { from, to } = data.payload;

      if (from !== remoteUser || to !== userName) {
        console.warn("⚠️ Mismatched connection names. Ignoring message.");
        return;
      }

      switch (data.event) {
        case "callAccepted": {
          if (!isInitiater) return;
          console.log("✅ Call accepted by callee");
          setIsCallActive(true);
          const offer = await createOffer();
          socket.send("sendOffer", { from: userName, to: remoteUser, offer })
        }
          break;
        case "receiveOffer": {
          const { offer } = data.payload;
          if (isInitiater) return;
          const ans = await sendAnswer(offer)
          socket.send("sendAnswer", { from: userName, to: remoteUser, answer: ans })
          break;
        }

        case "receiveAnswer": {
          const { answer } = data.payload;
          await setRemoteAns(answer)
          break;
        }
      }
    };

    socket.addEventListener('message', handleConnectionMessages);

    return () => {
      socket.removeEventListener('message', handleConnectionMessages);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remoteUser, socket, userName, isInitiater, isCallActive]);

  // Setup media streams AFTER peer connection is initialized
  useEffect(() => {
    const setupMediaStream = async () => {
      console.log("🎥 Setting up local media stream");
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      sendStream(localStream)
      setLocalStream(stream)
    }

    setupMediaStream()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMic = () => {
    const audioTrack = localStream.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(audioTrack.enabled);
      console.log(`🎤 Microphone ${audioTrack.enabled ? 'enabled' : 'disabled'}`);
    }
  };

  const toggleVideo = () => {
    const videoTrack = localStream.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOn(videoTrack.enabled);
      console.log(`📹 Camera ${videoTrack.enabled ? 'enabled' : 'disabled'}`);
    }
  };

  const callEnded = () => {
    console.log("📴 Ending Call");
    socket.send(JSON.stringify({
      event: "hangUp",
      payload: { from: userName, to: remoteUser }
    }));
    resetStates();
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex-1 relative">
        <video
          src={remoteStream}
          autoPlay
          playsInline
          className={`w-full h-full object-cover ${remoteStream ? 'block' : 'hidden'}`}
        />

        {!remoteStream && (
          <div className="absolute inset-0 flex items-center justify-center text-white text-xl">
            <div className="text-center">
              <div className="animate-pulse mb-4">📞</div>
              <p>Connecting...</p>
              <p className="text-sm text-gray-400 mt-2">Waiting for remote video</p>
            </div>
          </div>
        )}

        <div className="absolute bottom-4 right-4 w-32 h-48 z-10 border-2 border-white rounded-lg overflow-hidden shadow-2xl">
          <video
            src={localStream}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="bg-gray-800 text-white p-4 flex justify-center gap-8">
        {isCallActive && (
          <>
            <button
              className={`p-3 rounded-full h-12 w-12 flex items-center justify-center transition-colors ${isMicOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
                }`}
              onClick={toggleMic}
              title={isMicOn ? 'Mute' : 'Unmute'}
            >
              {isMicOn ? <IoMic className='text-2xl' /> : <IoMicOff className='text-2xl' />}
            </button>

            <button
              className={`p-3 rounded-full h-12 w-12 flex items-center justify-center transition-colors ${isCameraOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
                }`}
              onClick={toggleVideo}
              title={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
            >
              {isCameraOn ? <IoVideocam className='text-2xl' /> : <IoVideocamOff className='text-2xl' />}
            </button>
          </>
        )}

        <button
          className="p-3 bg-red-600 hover:bg-red-700 rounded-full h-12 w-12 flex items-center justify-center shadow-lg transition-colors"
          onClick={callEnded}
          title="End call"
        >
          <IoCall className='text-2xl rotate-[135deg]' />
        </button>
      </div>
    </div>
  );
};

export default VideoCallScreen;