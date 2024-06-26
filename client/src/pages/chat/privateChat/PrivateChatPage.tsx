import React, { useEffect, useState } from "react";
import { useUser } from "../../../lib/contexts/UserContext";
import LoadingPage from "../../etc/LoadingPage";
import NotFoundPage from "../../etc/NotFoundPage";
import ChatSearchBox from "../../../components/Chat/ChatSearchBox";
import ChatListElement from "../../../components/Chat/ChatListElement";
import ChatPanel from "../../../components/Chat/ChatPanel/ChatPanel";
import { Chat } from "../../../lib/types/Chat";
import { useParams } from "react-router-dom";
import { socket } from "../../../lib/socket";

const PrivateChatPage = () => {
  let { chatId } = useParams();

  // const location = useLocation()

  const { currentUser, isLoading } = useUser();

  const [searchName, setSearchName] = useState<string>("");

  const [chatRooms, setChatRooms] = useState<Chat[]>([]);

  async function initChatRooms() {
    if (!currentUser) return;
    const res = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/users/" + currentUser.id + "/chats",
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (res.ok) {
      const data: Chat[] = await res.json();

      // Check if you are in sender room
      // console.log(window.location.pathname)
      const pathList = window.location.pathname.split("/");

      if (pathList.length < 4) {
        setChatRooms(data);
        return;
      }
      // console.log(pathList[2])
      // const currentRoom: Chat | undefined = data.find((chat) => chat.id === chatId)
      const currentRoomIdx: number = data.findIndex(
        (chat) => chat.id === pathList[3]
      ); // use chatId from location instead because chatId from params is not state, it will not work

      if (currentRoomIdx !== -1) {
        if (
          currentUser.id === data[currentRoomIdx].participantA.id &&
          data[currentRoomIdx].participantAUnread != 0
        ) {
          console.log("Read 1");
          const readRes = await fetch(
            import.meta.env.VITE_BACKEND_URL +
              "/chats/" +
              data[currentRoomIdx].id +
              "/read",
            {
              method: "PUT",
              credentials: "include",
            }
          );
          data[currentRoomIdx].participantAUnread = 0;
        } else if (
          currentUser.id === data[currentRoomIdx].participantB.id &&
          data[currentRoomIdx].participantBUnread != 0
        ) {
          console.log("Read 2");
          const readRes = await fetch(
            import.meta.env.VITE_BACKEND_URL +
              "/chats/" +
              data[currentRoomIdx].id +
              "/read",
            {
              method: "PUT",
              credentials: "include",
            }
          );
          data[currentRoomIdx].participantBUnread = 0;
        } else {
          console.log(res);
          console.log("Doesn't Read");
        }
      }

      console.log(data);

      setChatRooms(data);
    }
  }

  useEffect(() => {
    if (currentUser) {
      initChatRooms();
    }
  }, [isLoading]);

  useEffect(() => {
    window.document.title = "Private Chats";
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    socket.on(`users:${currentUser.id}:chatsUpdate`, () => {
      initChatRooms();
    });

    socket.on("updateData", () => {
      initChatRooms();
    });

    return function cleanup() {
      socket.off(`users:${currentUser.id}:chatsUpdate`);
      socket.off("updateData");
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
                if (currentUser.id === chat.participantA.id) {
                  return chat.participantB.displayName
                    .toLowerCase()
                    .includes(searchName.toLowerCase());
                } else {
                  return chat.participantA.displayName
                    .toLowerCase()
                    .includes(searchName.toLowerCase());
                }
              })
              .map((chat) => {
                return (
                  <ChatListElement
                    key={chat.id}
                    chat={chat}
                    setChatRooms={setChatRooms}
                  />
                );
              })}
          </div>
        </div>
      </div>
      <div className="h-full w-3/4 flex flex-col">
        {chatId && <ChatPanel chatId={chatId} />}
      </div>
    </div>
  );
};

export default PrivateChatPage;
