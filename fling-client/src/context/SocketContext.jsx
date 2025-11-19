import { useReducer, useState } from "react";
import { useEffect } from "react";
import userReducer from "../reducers/userReducer";
import { SocketContext } from "../hooks/useSocket";
import { useCallState } from "../hooks/useCallState";
import { useAfterCallState } from "../hooks/useAfterCallState";

const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    const [users, dispatch] = useReducer(userReducer, [])
    const { setRemoteUser, setShowCallNotification, resetStates } = useCallState()
    const { isCallActive, resetCallState } = useAfterCallState()

    //component level states
    const [userName, setUserName] = useState(null);

    useEffect(() => {
        if (userName === null) return;

        const newSocket = new WebSocket(`ws://localhost:8080?userName=${userName}`)

        newSocket.onopen = () => {
            console.log("connected to the socket")
            setSocket(newSocket)
        }

        newSocket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            console.log(data)

            switch (data.event) {
                case "userNameTaken":
                    setUserName(null)
                    break;
                case "activeUserData":
                    dispatch({
                        type: "set",
                        users: data.userNames
                    })
                    break;
                case "newUser":
                    dispatch({
                        type: "add",
                        userName: data.userName
                    })
                    break;
                case "removeUser":
                    dispatch({
                        type: "delete",
                        userName: data.userName
                    })
                    break;
                case "incomingCall": {
                    const { from } = data.payload
                    if (isCallActive) {
                        newSocket.send(JSON.stringify({ event: "callDeclined", payload: { from: userName, to: from, message: "User is active in other call" } }))
                    } else {
                        setRemoteUser(from)
                        setShowCallNotification(true)
                    }
                }
                    break;
                case "callDeclined":
                    resetStates()
                    resetCallState()
                    break;
                case "hangUp":
                    console.log(isCallActive)
                    resetStates()
                    resetCallState()
                    break;
            }
        }

        newSocket.onerror = () => {
            console.log("server error")
        }

        return () => {
            newSocket.close()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userName])

    return (
        <SocketContext.Provider value={{ socket, users, userName, setUserName }}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider
