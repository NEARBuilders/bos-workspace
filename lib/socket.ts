import http from "http";
import { Server as IoServer } from "socket.io";
import { DevJson } from "./dev";

/**
 * Starts web socket server
 * @param server Http server
 * @param callback callback function to handle socket events
 * @returns 
 */
export function startSocket(server: http.Server, callback: (io: IoServer) => void): IoServer {
  const io = new IoServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    },
  });

  log.success("Socket server setup successfully.");

  io.on("connection", (socket) => {
    log.debug(`Socket connected: ${socket.id}`);
    socket.on("disconnect", () => {
      log.debug(`Socket disconnected: ${socket.id}`);
    })
    callback(io)
  });

  return io;
}

export function notifyClientsOfChange(io: IoServer, devJson: DevJson) {
  if (io) {
    io.emit("fileChange", devJson);
  }
}
