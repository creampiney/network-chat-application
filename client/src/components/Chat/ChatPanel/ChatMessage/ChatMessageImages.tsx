import React from "react";
import ImageModal from "../../../etc/ImageModal";

const ChatMessageImages = ({ images }: { images: string[] }) => {
  return (
    <div className="flex flex-col gap-2 h-fit">
      {/* {images.map((image, idx) => {
        return <img src={image} key={idx} className="w-64 object-cover" />;
      })} */}
      {images.map((image, idx) => {
        return <ImageModal key={idx} image={image} />
      })}
    </div>
  );
};

export default ChatMessageImages;
