import { Avatar } from "@mui/material";
import ImageUploading, { ImageListType, ImageType } from "react-images-uploading";

type ImageInputProps = {
  fieldName: string,
  image: ImageType, 
  setImage: React.Dispatch<React.SetStateAction<ImageType>>,
  defaultImageURL: string
}

const ImageInput = ({fieldName, image, setImage, defaultImageURL}: ImageInputProps) => {

  function onChange(imageList: ImageListType, addUpdateIndex: number[] | undefined) {
    setImage(imageList[0])
  }

  function onSetDefault() {
    setImage({dataURL: defaultImageURL})
  }

  return (
    <div className="w-full">
      
          <label className="form-control w-full flex gap-3">
            <div className="label">
                <span className="label-text font-semibold">{fieldName}</span>
            </div>
            <div className="w-full flex gap-3">
              <div className="flex item-center justify-center">
                <Avatar src={image.dataURL} sx={{ width: 60, height: 60 }} />
              </div>
              <div className="grow flex gap-3 items-center">
                <ImageUploading
                  value={[image]}
                  onChange={onChange}
                >
                  {({
                    onImageUpload
                  }) => (
                          <button type="button" className="primary-button" onClick={onImageUpload}>Upload Image</button>
                      )}
                </ImageUploading>
                <button type="button" className="primary-button" onClick={onSetDefault}>Remove Image</button>
              </div>
            </div>
          </label>
        
    </div>
  )
}

export default ImageInput