import './App.css'
import { ThemeProvider } from './lib/contexts/ThemeContext'
import LoginPage from './pages/login/LoginPage'

function App() {

  return (
    <>
      <ThemeProvider>
        <LoginPage />
      </ThemeProvider>
      
    </>
  )
}

export default App
