import React from "react";

const ChatMessageText = ({ text }: { text: string }) => {
  return <div className="chat-bubble bg-slate-200 dark:bg-slate-700 secondary-text break-words">{text}</div>;
};

export default ChatMessageText;
