import { useState } from "react";
import { CallContext } from "../hooks/useCallState";

const CallProvider = ({ children }) => {

    const [callType, setCallType] = useState(null);
    const [remoteUser, setRemoteUser] = useState(null);
    const [isCallActive, setIsCallActive] = useState(false);
    const [showCallNotification, setShowCallNotification] = useState(false)
    const [isInitiater, setIsInitiater] = useState(false);

    const resetStates = () => {
        setCallType(null)
        setRemoteUser(null)
        setIsCallActive(false)
        setShowCallNotification(false)
        setIsInitiater(false)
    }


    return (
        <CallContext.Provider value={{ showCallNotification, callType, remoteUser, isCallActive, isInitiater, setIsInitiater, setCallType, setRemoteUser, setIsCallActive, setShowCallNotification, resetStates }}>
            {children}
        </CallContext.Provider>
    )
}

export default CallProvider