import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../lib/contexts/UserContext";
import LoadingPage from "../etc/LoadingPage";
import Sidebar from "../../components/sidebar/Sidebar";
import Home from "../../components/home/Home";
import useAuthRedirect from "../../lib/authRedirect";
import { socket } from "../../lib/socket";
import { useEffect, useState } from "react";
import { z } from "zod";
import { DeepSet } from "../../lib/DeepSet";

export type UserObject = {
  userId: string;
  displayName: string;
};

type DataAccept = {
  userCount: number;
  userMap: UserObject[];
};

const ChatPage = ({ current }: { current?: string }) => {
  const { currentUser, isLoading } = useUser();
  const [userCount, setUserCount] = useState<number>(0);
  const [userMap, setUserMap] = useState<UserObject[]>([]);
  useAuthRedirect();

  useEffect(() => {
    if (!currentUser) return;

    socket.on("global-chat", ({ userMap }: DataAccept) => {
      const target = [...new DeepSet(userMap)];
      setUserMap(target);

      setUserCount(target.length);
    });

    socket.emit("join-global-chat", {
      userId: currentUser.id,
      displayName: currentUser.displayName,
    });

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
        <Outlet context={{ userCount: userCount, userMap: userMap }} />
      </div>
    </div>
  );
};

export default ChatPage;
