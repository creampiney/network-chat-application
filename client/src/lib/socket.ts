import { io } from "socket.io-client";

const URL = import.meta.env.VITE_APP_SOCKET_ENDPOINT || "http://localhost:3001";

export const socket = io(URL);
