import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../lib/contexts/UserContext";
import LoadingPage from "../etc/LoadingPage";
import Sidebar from "../../components/sidebar/Sidebar";
import Home from "../../components/home/Home";
import useAuthRedirect from "../../lib/authRedirect";
import { socket } from "../../lib/socket";
import { useEffect } from "react";

const ChatPage = ({ current }: { current?: string }) => {
  const { currentUser, isLoading } = useUser();

  useAuthRedirect();

  useEffect(() => {
    if (!currentUser) return;

    socket.on("global-chat", (message) => {
      console.log(message);
    });

    socket.emit("join-global-chat");

    return function cleanup() {
      socket.off("global-chat", () => {
        console.log("disconnected");
      });
    };
  }, [isLoading]);

  if (isLoading) return <LoadingPage />;

  if (!currentUser) return <Navigate to="/" replace={true} />;

  return (
    <div className="full-page flex-row">
      <Sidebar current={current} />
      <div className="grow h-full overflow-y-auto">
        {/* {current === "home" && <Home />} */}
        <Outlet />
      </div>
    </div>
  );
};

export default ChatPage;
