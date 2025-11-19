import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import SocketProvider from './context/SocketContext.jsx'
import AfterCallStateProvider from './context/AfterCallContext.jsx'
import CallProvider from './context/BeforeCallContext.jsx'
import PeerProvider from './context/PeerContext.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <CallProvider>
    <AfterCallStateProvider>
      <PeerProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </PeerProvider>
    </AfterCallStateProvider>
  </CallProvider>
  // </StrictMode>,
)
