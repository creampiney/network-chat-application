import { Avatar, Box, Modal, Tooltip } from "@mui/material"
import { PublicChat } from "../../../lib/types/Chat"
import { useState } from "react";
import { IoMdPeople } from "react-icons/io";
import { useUser } from "../../../lib/contexts/UserContext";
import { Navigate, useNavigate } from "react-router-dom";
import { createChat } from "../../../lib/chat";
import { IoChatbubbleEllipses } from "react-icons/io5";

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    height: 500,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

const PublicChatCurrentParticipants = ({ chat }: { chat: PublicChat }) => {
    const navigate = useNavigate()
    const { currentUser } = useUser()

    const [open, setOpen] = useState<boolean>(false);

    async function handleCreateChat(userId: string) {
      if (!currentUser) return;
  
      const chatId = await createChat(userId, currentUser.id);
      if (!chatId) return;
  
      navigate("/chat/private/" + chatId, { relative: "route" });
    }

    return (
        <>
            <Tooltip title="View Members">
                <button
                  onClick={() => setOpen(true)}
                  className="p-1 rounded-full aspect-square secondary-text hover:bg-slate-100 hover:dark:bg-slate-800 transition-colors items-center justify-center"
                >
                    <IoMdPeople className="w-6 h-6" />
                </button>
            </Tooltip>
            <Modal
              open={open}
              onClose={() => setOpen(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style} className="modal-box bg-white dark:bg-slate-800">
                <div className="relative flex flex-col gap-y-6">
                  <div className="sticky font-bold text-lg text-center primary-text">Members</div>
    
                  <ul className="flex flex-col py-2">
                    {chat.participants.map((user) => {
                      return (
                        <li
                          key={user.id}
                          className="flex justify-between items-center hover:bg-slate-200 dark:hover:bg-slate-700 py-2 px-3 transition-colors"
                        >
                          <div className={"flex items-center gap-5"}>
                            <Avatar
                              src={user.avatar}
                              sx={{ width: "48px", height: "48px" }}
                            />
                            <p className="text-base-100 font-bold">{user.displayName}{(currentUser && user.id === currentUser.id) && <span className="font-normal"> (me)</span>}</p>
                          </div>
                          {currentUser?.id != user.id && (
                            <Tooltip title="Start Chatting">
                              <button
                                className="p-2 rounded-full aspect-square hover:bg-slate-100 hover:dark:bg-slate-800 transition-colors"
                                onClick={() => {
                                  handleCreateChat(user.id);
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
              </Box>
            </Modal>
        </>
    )
}

export default PublicChatCurrentParticipants