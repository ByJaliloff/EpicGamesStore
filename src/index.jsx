import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { GameProvider } from './context/DataContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <GameProvider>
    <App />
  </GameProvider>
  </BrowserRouter>
  
)
