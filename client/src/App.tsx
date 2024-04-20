import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "./lib/contexts/ThemeContext";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";
import ChatPage from "./pages/chat/ChatPage";
import { UserProvider } from "./lib/contexts/UserContext";
import Home from "./components/home/Home";

function App() {
  return (
    <>
      <BrowserRouter>
        <UserProvider>
          <ThemeProvider>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              {/* <Route path="/chat" element={<ChatPage current="home"/>} />
              <Route path="/chat/rooms" element={<ChatPage current="rooms" />} />
              <Route path="/chat/groups" element={<ChatPage current="groups" />} /> */}
              <Route path="chat" element={<ChatPage />}>
                <Route path="" element={<Home />} />
                <Route path="rooms" />
                <Route path="groups" />
              </Route>
            </Routes>
          </ThemeProvider>
        </UserProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
