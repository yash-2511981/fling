import { useState } from "react"
import { AfterCallContext } from "../hooks/useAfterCallState"

const AfterCallStateProvider = ({ children }) => {

    const [isCallActive, setIsCallActive] = useState(false);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);

    const resetCallState = () => {
        setIsCallActive(false)
        setIsMicOn(false)
        setIsCameraOn(false)
    }


    return <AfterCallContext.Provider value={{ isCallActive, isMicOn, isCameraOn, setIsCallActive, setIsMicOn, setIsCameraOn, resetCallState }}>
        {children}
    </AfterCallContext.Provider>
}

export default AfterCallStateProvider;