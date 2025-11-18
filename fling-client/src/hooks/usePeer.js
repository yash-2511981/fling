import { createContext, useContext } from "react"

export const PeerContext = createContext(null)

export const usePeer = () => useContext(PeerContext)

