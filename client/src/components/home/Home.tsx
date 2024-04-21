import { useNavigate, useOutletContext } from "react-router-dom";
import { UserObject } from "../../pages/chat/ChatPage";
import { Avatar } from "@mui/material";
import { useUser } from "../../lib/contexts/UserContext";
import { createChat } from "../../lib/chat";
import LoadingPage from "../../pages/etc/LoadingPage";

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
  if (!currentUser) <LoadingPage />;

  return (
    <div className="w-full py-5 px-6 page">
      <div className="flex flex-col w-full">
        <h2>Online Users Count : {userCount}</h2>
        <ul className="flex flex-col p-2">
          {userMap.map((user) => {
            return (
              <li
                key={user.userId}
                className="flex justify-between hover:bg-slate-300 py-2 dark:hover:bg-slate-700"
              >
                <div className={"flex items-center gap-5"}>
                  <Avatar
                    src={user.avatar}
                    sx={{ width: "48px", height: "48px" }}
                  />
                  <p className="text-base-100">{user.displayName}</p>
                </div>
                {currentUser?.id != user.userId && (
                  <button
                    className="primary-button"
                    onClick={() => {
                      handleCreateChat(user.userId);
                    }}
                  >
                    Chat with him/her
                  </button>
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
