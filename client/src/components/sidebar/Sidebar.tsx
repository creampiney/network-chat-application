import ThemeButton from "../etc/ThemeButton";
import { useUser } from "../../lib/contexts/UserContext";
import { Avatar } from "@mui/material";
import { IoHomeOutline } from "react-icons/io5";
import { LuMessagesSquare } from "react-icons/lu";
import { GrGroup } from "react-icons/gr";
import { useLocation, useNavigate } from "react-router-dom";
import MenuBar from "./MenuBar";

const Sidebar = ({ current }: { current?: string }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const { currentUser } = useUser();

  const menu = [
    {
      icon: <IoHomeOutline />,
      path: "/chat/home",
      name: "home",
    },
    {
      icon: <LuMessagesSquare />,
      path: "/chat/private",
      name: "private",
    },
    {
      icon: <GrGroup />,
      path: "/chat/groups",
      name: "groups",
    },
  ];

  return (
    <div className="w-16 h-full flex flex-col items-center justify-between">
      <div className="w-full flex flex-col items-center">
        {menu.map((data, idx) => {
          return (
            <button
              key={idx}
              className={
                "relative w-16 h-16 aspect-square flex flex-col items-center justify-center text-xl hover:bg-slate-100 dark:hover:bg-slate-800 " +
                (location.pathname.split("/")[2] === data.name && "text-indigo-500")
              }
              onClick={() => {
                if (location.pathname.split("/")[2] !== data.name) navigate(data.path);
              }}
            >
              {data.icon}
              {location.pathname.split("/")[2] === data.name && (
                <div className="absolute left-0 h-full w-1.5 bg-indigo-500"></div>
              )}
            </button>
          );
        })}
      </div>
      <div className="w-full flex flex-col items-center gap-5 pb-5">
        <ThemeButton />
        {currentUser && (
          <div className="dropdown dropdown-right dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="w-fit h-fit rounded-full"
            >
              <Avatar
                src={currentUser.avatar}
                sx={{ width: "48px", height: "48px" }}
              />
            </div>
            <div
              tabIndex={0}
              className="dropdown-content z-[1] menu shadow  rounded-box -bottom-2 border bg-white border-slate-100 dark:bg-slate-900 dark:border-slate-800 w-fit"
            >
              <MenuBar />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
