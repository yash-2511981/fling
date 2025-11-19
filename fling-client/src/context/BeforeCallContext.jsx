import { useState } from "react";
import { CallContext } from "../hooks/useCallState";

const CallProvider = ({ children }) => {

    const [callType, setCallType] = useState(null);
    const [remoteUser, setRemoteUser] = useState(null);
    const [showCallNotification, setShowCallNotification] = useState(false)
    const [isInitiater, setIsInitiater] = useState(false);

    const resetStates = () => {
        setCallType(null)
        setRemoteUser(null)
        setShowCallNotification(false)
        setIsInitiater(false)
    }


    return (
        <CallContext.Provider value={{ showCallNotification, callType, remoteUser, isInitiater, setIsInitiater, setCallType, setRemoteUser, setShowCallNotification, resetStates }}>
            {children}
        </CallContext.Provider>
    )
}

export default CallProvider