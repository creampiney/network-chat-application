import React, { useEffect, useState } from "react";
import { useUser } from "../../../lib/contexts/UserContext";
import LoadingPage from "../../etc/LoadingPage";
import NotFoundPage from "../../etc/NotFoundPage";
import ChatSearchBox from "../../../components/Chat/ChatSearchBox";
import ChatListElement from "../../../components/Chat/ChatListElement";
import ChatPanel from "../../../components/Chat/ChatPanel/ChatPanel";
import { Chat, PublicChat } from "../../../lib/types/Chat";
import { useParams } from "react-router-dom";
import { socket } from "../../../lib/socket";
import PublicChatListElement from "../../../components/PublicChat/PublicChatListElement";

const PublicChatPage = () => {
  let { chatId } = useParams();

  // const location = useLocation()

  const { currentUser, isLoading } = useUser();

  const [searchName, setSearchName] = useState<string>("");

  const [chatRooms, setChatRooms] = useState<PublicChat[]>([]);

  async function initChatRooms() {
    if (!currentUser) return;
    const res = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/users/public",
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (res.ok) {
      const data: PublicChat[] = await res.json();

      // Check if you are in sender room
      // console.log(window.location.pathname)
      setChatRooms(data);
    }
  }

  useEffect(() => {
    window.document.title = "Private Chats";
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    initChatRooms();
    socket.emit("public-chat:subscribe", {
      publicChatId: currentUser.publicChatId,
    });
    socket.on("public-chat:message", (mesg) => {
      console.log(mesg);
      initChatRooms();
      console.log("someone send you a message");
    });

    socket.on("updateData:public", () => {
      initChatRooms();
    });

    return function cleanup() {
      socket.off(`public-chat:message`);
      socket.off("updateData");
      socket.emit("public-chat:unsubscribe", {
        publicChatId: currentUser.publicChatId,
      });
    };
  }, [isLoading]);

  if (isLoading) return <LoadingPage />;
  if (!currentUser) return <NotFoundPage />;

  return (
    <div className="w-full h-full flex">
      <div className="h-full w-1/4 flex flex-col border-r border-slate-300 dark:border-slate-600">
        <ChatSearchBox
          value={searchName}
          onChange={(e) => {
            setSearchName(e.target.value);
          }}
        />
        <div className="w-full h-full overflow-y-auto bg-slate-200 dark:bg-slate-700">
          <div className="flex flex-col flex-nowarp">
            {chatRooms
              .filter((chat) => {
                return chat.chatName
                  .toLowerCase()
                  .includes(searchName.toLowerCase().trim());
              })
              .map((chat) => {
                return (
                  <PublicChatListElement
                    key={chat.id}
                    chat={chat}
                    setChatRooms={setChatRooms}
                    newChat={!currentUser.publicChatId.includes(chat.id)}
                  />
                );
              })}
          </div>
        </div>
      </div>
      <div className="h-full w-3/4 flex flex-col">
        {/* {chatId && <ChatPanel chatId={chatId} />} */}
      </div>
    </div>
  );
};

export default PublicChatPage;
