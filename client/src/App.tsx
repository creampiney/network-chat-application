import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { ThemeProvider } from './lib/contexts/ThemeContext'
import LoginPage from './pages/login/LoginPage'
import RegisterPage from './pages/register/RegisterPage'
import ChatPage from './pages/chat/ChatPage'
import { UserProvider } from './lib/contexts/UserContext'

function App() {

  return (
    <>
      <BrowserRouter>
        <UserProvider>
          <ThemeProvider>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/chat" element={<ChatPage />} />
            </Routes>
          </ThemeProvider>
        </UserProvider>
      </BrowserRouter>
    </>
  )
}

export default App
