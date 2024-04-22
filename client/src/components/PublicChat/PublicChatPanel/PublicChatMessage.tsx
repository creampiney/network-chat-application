import React from "react";
import ChatMessageText from "../../Chat/ChatPanel/ChatMessage/ChatMessageText";
import ChatMessageImages from "../../Chat/ChatPanel/ChatMessage/ChatMessageImages";
import ChatMessageLocation from "../../Chat/ChatPanel/ChatMessage/ChatMessageLocation";
import { Message } from "../../../lib/types/Chat";
import { useUser } from "../../../lib/contexts/UserContext";


type PublicChatMessageProps = {
  message: Message;
};

const PublicChatMessage = ({
  message,
}: PublicChatMessageProps) => {

  const {currentUser} = useUser()

  if (currentUser && currentUser.id !== message.senderId) {
    return (
      <div className="chat chat-start">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img src={message.sender?.avatar || ""} />
          </div>
        </div>
        <div className="secondary-text text-xs">
          {new Date(message.sentAt).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
        {message.type === "Text" ? (
          <ChatMessageText text={message.text || ""} />
        ) : message.type === "Images" ? (
          <ChatMessageImages
            images={message.pictures ? message.pictures : []}
          />
        ) : (
          <ChatMessageLocation
            latitude={message.latitude ? message.latitude : 0}
            longitude={message.longitude ? message.longitude : 0}
          />
        )}
        <div className="secondary-text text-xs">{message.sender?.displayName || ""}</div>
      </div>
    );
  } else {
    return (
      <div className="chat chat-end flex flex-col">
        <div className="secondary-text text-xs">
          {new Date(message.sentAt).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
        {message.type === "Text" ? (
          <ChatMessageText text={message.text || ""} />
        ) : message.type === "Images" ? (
          <ChatMessageImages
            images={message.pictures ? message.pictures : []}
          />
        ) : (
          <ChatMessageLocation
            latitude={message.latitude ? message.latitude : 0}
            longitude={message.longitude ? message.longitude : 0}
          />
        )}
      </div>
    );
  }
};

export default PublicChatMessage;
