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
import { LuUser2 } from "react-icons/lu";
import { ImageType } from "react-images-uploading";
import ImageInput from "../form/ImageInput";
import { uploadImages } from "../../lib/firebase";

const UserSchema = z.object({
  displayName: z.string().min(1),
});

type User = z.infer<typeof UserSchema>;

function MenuBar() {
  const iconClassName = "h-4 w-4";
  const navigate = useNavigate();
  const { currentUser, fetchUser } = useUser();
  const [open, setOpen] = useState<boolean>(false);

  const [newAvatar, setNewAvatar] = useState<ImageType>({dataURL: currentUser?.avatar})

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<User>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      displayName: currentUser?.displayName
    }
  });

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  
  const menuList = [
    {
      name: "Edit Profile",
      icon: <LuUser2 className={iconClassName} />,
      onClick: () => {setOpen(true)}
    },
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
    const newAvatarURL = (await uploadImages([newAvatar], "avatar"))[0];

    const result = await fetch(import.meta.env.VITE_BACKEND_URL + "/users/", {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({...data, avatar: newAvatarURL}),
    });
    if (result.ok) {
      navigate(0);
    }
  };


  return (
    <div className="w-fit">
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
              <div className="flex flex-col items-center gap-2 p-2 bg-white dark:bg-slate-900">
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

                  <ImageInput
                    fieldName="Avatar"
                    image={newAvatar}
                    setImage={setNewAvatar}
                    defaultImageURL="https://firebasestorage.googleapis.com/v0/b/networkchatapplication.appspot.com/o/avatar%2Favatar2.png?alt=media&token=6c4120d7-47b7-4030-909f-a4da1904561b"
                  />
                  
                  <button type="submit" className="primary-button">
                    Confirm
                  </button>
                </form>
              </div>
            </Drawer>

            <div
              id="gradientText"
              className="text-base font-bold primary-text pointer-events-none"
            >
              {currentUser.displayName}
            </div>
          </li>
        )}
        {menuList.map((data) => {
          if (currentUser) {
            return (
              <li key={data.name}>
                <button
                  className="w-full flex items-center hover:bg-slate-100 dark:hover:bg-slate-800 secondary-text"
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
