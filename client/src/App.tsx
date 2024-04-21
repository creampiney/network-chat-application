import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "./lib/contexts/ThemeContext";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";
import ChatPage from "./pages/chat/ChatPage";
import { UserProvider } from "./lib/contexts/UserContext";
import Home from "./components/home/Home";
import PrivateChatPage from "./pages/chat/privateChat/PrivateChatPage";
import PublicChatListElement from "./components/PublicChat/PublicChatListElement";
import PublicChatPage from "./pages/chat/publicChat/PublicChatPage";

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
                <Route
                  path=""
                  element={<Navigate to="/chat/home" replace={true} />}
                />
                <Route path="home" element={<Home />} />
                <Route path="private" element={<PrivateChatPage />} />
                <Route path="private/:chatId" element={<PrivateChatPage />} />

                <Route path="groups" element={<PublicChatPage />} />
              </Route>
            </Routes>
          </ThemeProvider>
        </UserProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
