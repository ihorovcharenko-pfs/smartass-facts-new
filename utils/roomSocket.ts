import { io, type Socket } from "socket.io-client";
import { API_BASE_URL } from "../services/clientService";

let _socket: Socket | null = null;

export function getRoomSocket(): Socket {
  if (!_socket) {
    _socket = io(API_BASE_URL, {
      transports: ["websocket", "polling"],
      autoConnect: false,
    });
  }
  return _socket;
}

export function connectRoomSocket(): Socket {
  const s = getRoomSocket();
  if (!s.connected) s.connect();
  return s;
}

export function disconnectRoomSocket() {
  if (_socket) {
    _socket.disconnect();
    _socket = null;
  }
}
