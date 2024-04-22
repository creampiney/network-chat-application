import React, { useState } from "react";
import { IoIosSend } from "react-icons/io";
import { socket } from "../../../lib/socket";
import { useUser } from "../../../lib/contexts/UserContext";
import { ImageType } from "react-images-uploading";
import { uploadImages } from "../../../lib/firebase";
import { Chat, PublicChat } from "../../../lib/types/Chat";
import ChatMessageSendLocation from "../../Chat/ChatPanel/ChatMessageSendLocation";
import ChatMessageSendImages from "../../Chat/ChatPanel/ChatMessageSendImages";

const PublicChatMessageSendBox = ({
  publicChat,
  publicChatId,
}: {
  publicChat: PublicChat;
  publicChatId: string;
}) => {
  const { currentUser } = useUser();

  const [text, setText] = useState<string>("");
  const [images, setImages] = useState<ImageType[]>([]);
  const [latitude, setLatitude] = useState<number>(13.73377);
  const [longitude, setLongitude] = useState<number>(100.63558);

  function submitText(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!currentUser || text.length === 0) {
      return;
    }
    socket.emit(
      `publicChats:sendMessage`,
      {
        senderId: currentUser.id,
        publicChatId: publicChatId,
        type: "Text",
        text: text,
        sentAt: new Date(),
      }
    );
    setText("");
  }

  async function submitImages() {
    if (!currentUser) {
      return false;
    }
    const imagesURL = await uploadImages(images, "publicChats/" + publicChatId + "/images");

    socket.emit(
      `publicChats:sendMessage`,
      {
        senderId: currentUser.id,
        publicChatId: publicChatId,
        type: "Images",
        pictures: imagesURL,
        sentAt: new Date(),
      }
    );
  }

  async function submitLocation() {
    if (!currentUser) {
      return false;
    }

    socket.emit(
      `publicChats:sendMessage`,
      {
        senderId: currentUser.id,
        publicChatId: publicChatId,
        type: "Location",
        latitude: latitude,
        longitude: longitude,
        sentAt: new Date(),
      }
    );
  }

  return (
    <div className="w-full h-16 flex items-center bg-slate-200 dark:bg-slate-700 gap-4 px-5">
      {/* <button><FaLocationDot className="text-xl fond-bold text-indigo-600" /></button> */}
      {/* <button><FaImage className="text-xl fond-bold text-indigo-600" /></button> */}
      <ChatMessageSendLocation
        latitude={latitude}
        longitude={longitude}
        setLatitude={setLatitude}
        setLongitude={setLongitude}
        submitLocation={submitLocation}
      />
      <ChatMessageSendImages
        images={images}
        setImages={setImages}
        submitImages={submitImages}
      />
      <form className="flex items-center w-full gap-4" onSubmit={submitText}>
        <input
          type="text"
          className="block rounded-full p-2 ps-5 text-sm bg-slate-50 border border-gray-300 text-gray-900 w-full dark:bg-slate-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          placeholder="Aa"
          value={text}
          onChange={(e) => setText(e.target.value.substring(0, 512))}
        />
        <button type="submit">
          <IoIosSend className="text-xl fond-bold text-indigo-600 dark:text-indigo-300" />
        </button>
      </form>
    </div>
  );
};

export default PublicChatMessageSendBox;
