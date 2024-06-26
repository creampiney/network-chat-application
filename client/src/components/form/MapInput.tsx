import { useEffect, useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  MapCameraChangedEvent,
  MapCameraProps,
} from "@vis.gl/react-google-maps";
export default function MapInput({
  lat,
  lng,
  setLat,
  setLng,
}: {
  lat: number;
  lng: number;
  setLat: React.Dispatch<React.SetStateAction<number>>;
  setLng: React.Dispatch<React.SetStateAction<number>>;
}) {
  const position = { lat: lat, lng: lng };
  const [cameraProps, setCameraProps] = useState<MapCameraProps>({
    center: { lat: lat, lng: lng },
    zoom: 9,
  });
  const handleCameraChange = (ev: MapCameraChangedEvent) =>
    setCameraProps(ev.detail);

  useEffect(() => {
    setCameraProps({
      center: { lat: lat, lng: lng },
      zoom: cameraProps.zoom,
    });
  }, [lat, lng]);

  function changePin(newLat: number, newLng: number) {
    setLat(Number(newLat.toFixed(5)));
    setLng(Number(newLng.toFixed(5)));
  }

  const [isOpen, setOpen] = useState<boolean>(false);
  return (
    <APIProvider apiKey={import.meta.env.VITE_APP_MAP_API_KEY as string}>
      <div className="w-full h-full">
        <Map
          {...cameraProps}
          mapId={import.meta.env.VITE_APP_MAP_ID as string}
          onCameraChanged={handleCameraChange}
          onClick={(e) => {
            if (e.detail.latLng) {
              changePin(e.detail.latLng.lat, e.detail.latLng.lng);
            }
          }}
          disableDefaultUI={true}
        >
          <AdvancedMarker
            position={position}
            onClick={() => {
              setOpen(true);
            }}
          >
            <Pin
              background={"grey"}
              borderColor={"green"}
              glyphColor={"purple"}
            ></Pin>
          </AdvancedMarker>
          {isOpen && (
            <InfoWindow position={position}>
              <p>Pin Location</p>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
}
