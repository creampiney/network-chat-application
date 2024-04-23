import { Avatar } from "@mui/material";
import { PublicChat } from "../../../lib/types/Chat";
import { useUser } from "../../../lib/contexts/UserContext";
import PublicChatCurrentParticipants from "./PublicChatCurrentParticipants";

const PublicChatTitle = ({ publicChat }: { publicChat: PublicChat | undefined }) => {
  const { currentUser } = useUser();

  if (!publicChat || !currentUser) {
    return (
      <div className="w-full h-14 flex px-5 items-center bg-slate-200 dark:bg-slate-700">
        <div className="flex items-center gap-2">
          <Avatar sx={{ width: 36, height: 36 }} />
          <div className="font-bold text-sm"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-14 flex px-5 items-center bg-slate-200 dark:bg-slate-700">
      <div className="flex items-center w-full gap-2">
        <Avatar
          sx={{ width: 36, height: 36 }}
          src={publicChat.chatAvatar}
        />
        <div className="font-bold text-sm secondary-text">
          {publicChat.chatName}
        </div>
        <div className="grow flex justify-end">
          <PublicChatCurrentParticipants chat={publicChat} />
        </div>
      </div>
    </div>
  );
};

export default PublicChatTitle;
