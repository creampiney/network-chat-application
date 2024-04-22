import { Avatar } from "@mui/material";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { PublicChat } from "../../lib/types/Chat";
import { useUser } from "../../lib/contexts/UserContext";

const PublicChatListElement = ({
  chat,
  setChatRooms,
  newChat,
}: {
  chat: PublicChat;
  setChatRooms: React.Dispatch<React.SetStateAction<PublicChat[]>>;
  newChat: boolean;
}) => {
  const { currentUser, isLoading } = useUser();

  if (!currentUser) {
    return <></>;
  }

  const onJoin = async () => {
    const result = await fetch(
      import.meta.env.VITE_BACKEND_URL + `/chats/public/${chat.id}/join`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    console.log(result);
  };

  return (
    <Link
      to={"/chat/groups/" + chat.id}
      onClick={onJoin}
      className={
        "w-full h-16 flex flex-col items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs text-black " +
        (newChat ? "bg-orange-400" : "")
      }
    >
      <div className="w-full px-5 flex gap-3 secondary-text">
        <Avatar src={chat.chatAvatar} />
        <div className="h-full grow overflow-clip flex flex-col gap-1 justify-center">
          <div className="font-bold text-sm truncate">
            {chat.chatName}
          </div>
          {chat.latestMessage &&
            (chat.latestMessage.type === "Text" ? (
              <p className="truncate">
                {currentUser.id === chat.latestMessage.senderId
                  ? "You"
                  : chat.latestMessage.sender?.displayName}
                : {chat.latestMessage.text}
              </p>
            ) : chat.latestMessage.type === "Images" ? (
              <p className="truncate">
                {currentUser.id === chat.latestMessage.senderId
                  ? "You"
                  : chat.latestMessage.sender?.displayName}{" "}
                sent {chat.latestMessage.pictures?.length || 1} image
                {(chat.latestMessage.pictures?.length || 1) > 1 && "s"}
              </p>
            ) : (
              <p className="truncate">
                {currentUser.id === chat.latestMessage.senderId
                  ? "You"
                  : chat.latestMessage.sender?.displayName}{" "}
                sent a location
              </p>
            ))}
        </div>
        <div className="flex flex-col items-end">
          {chat.latestMessage && (
            <div className="secondary-text text-xs">
              {new Date(chat.latestMessage.sentAt).toDateString() ===
              new Date().toDateString()
                ? new Date(chat.latestMessage.sentAt).toLocaleTimeString(
                    "en-US",
                    { hour: "2-digit", minute: "2-digit" }
                  )
                : new Date(chat.latestMessage.sentAt).toLocaleDateString(
                    "en-GB",
                    { day: "2-digit", month: "2-digit", year: "2-digit" }
                  )}
            </div>
          )}
          {/* {(currentUser.id === chat.participantA.id
            ? chat.participantAUnread !== 0
            : chat.participantBUnread !== 0) && (
            <div className="px-2 py-1 bg-indigo-200 text-indigo-800 font-bold rounded-full">
              {currentUser.id === chat.participantA.id
                ? chat.participantAUnread
                : chat.participantBUnread}
            </div>
          )} */}
        </div>
      </div>
    </Link>
  );
};

export default PublicChatListElement;
