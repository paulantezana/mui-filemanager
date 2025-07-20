import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
// import { LayoutTheme } from './themes/LayoutTheme.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <LayoutTheme> */}
      <App />
    {/* </LayoutTheme> */}
  </StrictMode>,
)
