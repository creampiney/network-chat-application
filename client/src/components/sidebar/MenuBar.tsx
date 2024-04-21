import { MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../lib/contexts/UserContext";
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { socket } from "../../lib/socket";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import TextInput from "../form/TextInput";

const UserSchema = z.object({
  displayName: z.string().min(1),
});

type User = z.infer<typeof UserSchema>;

function MenuBar() {
  const iconClassName = "h-4 w-4";
  const navigate = useNavigate();
  const { currentUser, fetchUser } = useUser();
  const [open, setOpen] = useState<boolean>(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<User>({
    resolver: zodResolver(UserSchema),
  });
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  const menuList = [
    {
      name: "Log Out",
      icon: <MdLogout className={iconClassName} />,
      onClick: async () => {
        try {
          const result = await fetch(
            import.meta.env.VITE_BACKEND_URL + "/auth/logout",
            {
              method: "POST",
              credentials: "include",
            }
          );

          await fetchUser();
          socket.emit("leave-global-chat");

          navigate("/");
        } catch (err) {
          console.log(err);
        }
      },
    },
  ];

  const onSubmit = async (data: User) => {
    console.log(data);
    const result = await fetch(import.meta.env.VITE_BACKEND_URL + "/users/", {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (result.ok) {
      navigate(0);
    }
  };

  const isTooCloseToWhite = (color: string): boolean => {
    const r: number = parseInt(color.substring(1, 3), 16);
    const g: number = parseInt(color.substring(3, 5), 16);
    const b: number = parseInt(color.substring(5, 7), 16);

    const brightness: number = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 200;
  };

  const getRandomColor = (): string => {
    const letters: string = "0123456789ABCDEF";
    let color: string = "#";

    do {
      color = "#";
      for (let i: number = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
    } while (isTooCloseToWhite(color));

    return color;
  };

  const gradientText = document.getElementById("gradientText");

  if (gradientText) {
    gradientText.style.backgroundImage = `linear-gradient(45deg, ${getRandomColor()}, ${getRandomColor()})`;
  }
  return (
    <div>
      <ul className="menu bg-base-200 w-56 rounded-box text-sm">
        {currentUser && (
          <li className="flex justify-center items-center">
            <button
              className="w-fit h-fit rounded-full"
              onClick={toggleDrawer(true)}
            >
              <Avatar sx={{ width: 52, height: 52 }} src={currentUser.avatar} />
            </button>
            <Drawer open={open} onClose={toggleDrawer(false)} anchor="bottom">
              <div className="flex flex-col items-center gap-2 p-2">
                <Avatar
                  sx={{ width: 52, height: 52 }}
                  src={currentUser.avatar}
                />
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col items-center"
                >
                  <TextInput
                    type={"text"}
                    fieldName={"New Display Name"}
                    placeholder={""}
                    name={"displayName"}
                    register={register}
                    error={errors.displayName}
                  />
                  <button type="submit" className="primary-button">
                    Confirm
                  </button>
                </form>
              </div>
            </Drawer>

            <div
              id="gradientText"
              className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 pointer-events-none"
            >
              Hello, {currentUser.displayName}
            </div>
          </li>
        )}
        {menuList.map((data) => {
          if (currentUser) {
            return (
              <li key={data.name}>
                <button
                  className="w-full flex items-center hover:bg-slate-100"
                  onClick={data.onClick}
                >
                  {data.icon}
                  <span className="text-sm">{data.name}</span>
                </button>
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
}

export default MenuBar;
