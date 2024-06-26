import { Drawer } from "@mui/material";
import React, { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import MapInput from "../../form/MapInput";

type ChatMessageSendLocationType = {
  latitude: number;
  longitude: number;
  setLatitude: React.Dispatch<React.SetStateAction<number>>;
  setLongitude: React.Dispatch<React.SetStateAction<number>>;
  submitLocation: () => void;
};

const ChatMessageSendLocation = ({
  latitude,
  longitude,
  setLatitude,
  setLongitude,
  submitLocation,
}: ChatMessageSendLocationType) => {
  const [open, setOpen] = useState(false);

  const [allowSend, setAllowSend] = useState<boolean>(true);


  function submit() {
    setAllowSend(false);
    submitLocation();
    setOpen(false);
    setAllowSend(true);
  }

  return (
    <>
      <button onClick={() => setOpen(true)}>
        <FaLocationDot className="text-xl fond-bold text-indigo-600 dark:text-indigo-300" />
      </button>
      <Drawer anchor="bottom" open={open} onClose={() => setOpen(false)}>
        <div className="px-5 py-5 h-96 relative bg-white dark:bg-slate-800 secondary-text">
          <div className="w-full h-full flex">
            <div className="w-1/2 flex flex-col">
              <div className="font-bold text-sm">Pin a location here</div>
              <div className="h-full w-full">
                <MapInput
                  lat={latitude}
                  lng={longitude}
                  setLat={setLatitude}
                  setLng={setLongitude}
                />
              </div>
            </div>
            <div className="w-1/2 flex flex-col pl-4">
              <div className="font-bold text-sm">
                or fill geolocation coordinate here
              </div>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text font-semibold">Latitude</span>
                </div>
                <input
                  type="number"
                  placeholder="0.00000"
                  step={0.00001}
                  className={
                    "primary-input"
                  }
                  value={latitude}
                  onChange={(e) => {
                    setLatitude(Number(e.target.value));
                  }}
                />
                <div className="label text-xs">
                  The value must be between -90 to 90
                </div>
              </label>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text font-semibold">Longitude</span>
                </div>
                <input
                  type="number"
                  placeholder="0.00000"
                  step={0.00001}
                  className={
                    "primary-input"
                  }
                  value={longitude}
                  onChange={(e) => {
                    setLongitude(Number(e.target.value));
                  }}
                />
                <div className="label text-xs">
                  The value must be between -180 to 180
                </div>
              </label>
            </div>
          </div>

          {allowSend &&
          latitude >= -90 &&
          latitude <= 90 &&
          longitude >= -180 &&
          longitude <= 180 ? (
            <button
              className="absolute bottom-5 right-5 primary-button"
              onClick={submit}
            >
              Send
            </button>
          ) : (
            <button
              className="absolute bottom-5 right-5 disabled-button"
              disabled
            >
              Send
            </button>
          )}
        </div>
      </Drawer>
    </>
  );
};

export default ChatMessageSendLocation;
