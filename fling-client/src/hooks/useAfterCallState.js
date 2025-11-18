import { createContext, useContext } from "react";

export const AfterCallContext = createContext(null)

export const useAfterCallState = () => useContext(AfterCallContext)