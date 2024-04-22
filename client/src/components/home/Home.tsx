import { useNavigate, useOutletContext } from "react-router-dom";
import { UserObject } from "../../pages/chat/ChatPage";
import { Avatar, Tooltip } from "@mui/material";
import { useUser } from "../../lib/contexts/UserContext";
import { createChat } from "../../lib/chat";
import LoadingPage from "../../pages/etc/LoadingPage";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { useEffect } from "react";

const Home = () => {
  const { userCount, userMap } = useOutletContext<{
    userCount: number;
    userMap: UserObject[];
  }>();
  const navigate = useNavigate();
  const { currentUser } = useUser();

  async function handleCreateChat(userId: string) {
    if (!currentUser) return;

    const chatId = await createChat(userId, currentUser.id);
    if (!chatId) return;

    navigate("/chat/private/" + chatId, { relative: "route" });
  }

  useEffect(() => {
    window.document.title = "Home"
  }, [])

  if (!currentUser) <LoadingPage />;

  return (
    <div className="w-full py-5 px-6 page">
      <div className="flex flex-col w-full">
        <h2>Online Users</h2>
        <span className="text-sm">{userCount} user{(userCount > 1) ? "s" : ""} online</span>
        <ul className="flex flex-col p-2">
          {userMap.map((user) => {
            return (
              <li
                key={user.userId}
                className="flex justify-between items-center hover:bg-slate-200 dark:hover:bg-slate-700 py-2 px-3 transition-colors"
              >
                <div className={"flex items-center gap-5"}>
                  <Avatar
                    src={user.avatar}
                    sx={{ width: "48px", height: "48px" }}
                  />
                  <p className="text-base-100 font-bold">{user.displayName}{(currentUser && user.userId === currentUser.id) && <span className="font-normal"> (me)</span>}</p>
                </div>
                {currentUser?.id != user.userId && (
                  <Tooltip title="Start Chatting">
                    <button
                      className="p-2 rounded-full aspect-square hover:bg-slate-100 hover:dark:bg-slate-800 transition-colors"
                      onClick={() => {
                        handleCreateChat(user.userId);
                      }}
                    >
                      <IoChatbubbleEllipses className="w-5 h-5" />
                    </button>
                  </Tooltip>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Home;
