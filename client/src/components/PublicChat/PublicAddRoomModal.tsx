import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Modal } from "@mui/material";
import { SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { ImageType } from "react-images-uploading";
import { z } from "zod";
import TextInput from "../form/TextInput";
import ImageInput from "../form/ImageInput";
import { useUser } from "../../lib/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { uploadImages } from "../../lib/firebase";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const schema = z.object({
  chatName: z.string().min(1),
});

type Schema = z.infer<typeof schema>;

export default function PublicAddRoomModal({
  open,
  handleClose,
  title,
  description,
}: {
  open: boolean;
  handleClose: () => void;
  title: string;
  description: string;
}) {
  const [avatar, setAvatar] = useState<ImageType>({
    dataURL:
      "https://firebasestorage.googleapis.com/v0/b/networkchatapplication.appspot.com/o/avatar%2Favatar2.png?alt=media&token=6c4120d7-47b7-4030-909f-a4da1904561b",
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });
  const navigate = useNavigate();
  const { currentUser, isLoading } = useUser();

  const onSubmit = async (data: Schema) => {
    if (!currentUser) return;
    const avatarURL = (await uploadImages([avatar], "Chatavatar"))[0];
    const submitData = {
      ...data,
      chatAvatar: avatarURL,
    };

    const result = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/chats/public/",
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      }
    );

    console.log(submitData);
    navigate(0);
  };
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} className="modal-box">
        <div className="flex flex-col gap-y-6">
          {/* <Typography id="modal-modal-title" variant="h6" component="h2">
Do you really want to delete this dorm?
</Typography> */}
          <div className="font-bold text-lg text-center">{title}</div>

          <div className="text-sm">{description}</div>
          <form
            className="flex gap-5 flex-col"
            onSubmit={handleSubmit(onSubmit)}
          >
            <TextInput
              type={"text"}
              fieldName={"Chat Room Name : "}
              placeholder={"type your chat room"}
              name={"chatName"}
              register={register}
              error={errors.chatName}
            />
            <ImageInput
              fieldName={"Chat room Avatar"}
              image={avatar}
              setImage={setAvatar}
              defaultImageURL={
                "https://firebasestorage.googleapis.com/v0/b/networkchatapplication.appspot.com/o/avatar%2Favatar2.png?alt=media&token=6c4120d7-47b7-4030-909f-a4da1904561b"
              }
            />
            <div className="flex">
              <button
                className="bordered-button w-full"
                type="button"
                onClick={handleClose}
              >
                No
              </button>
              <button className={`primary-button w-full`} type={"submit"}>
                Yes
              </button>
            </div>
          </form>
        </div>
      </Box>
    </Modal>
  );
}
