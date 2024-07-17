import { useEffect, useState } from "react";
import io from "socket.io-client";
import { flags } from "../config/flags.js";

function useRedirectMap() {
  const [devJson, setDevJson] = useState({
    components: {},
    data: {},
  });
  const [uWebSocket, setUWebSocket] = useState(flags.enableHotReload);

  useEffect(() => {
    if (uWebSocket) {
      const socket = io(`ws://${window.location.host}`, {
        reconnectionAttempts: 1, // Limit reconnection attempts
      });

      socket.on("fileChange", (d) => {
        console.log("File change detected via WebSocket", d);
        setDevJson(d);
      });

      socket.on("connect_error", () => {
        console.warn("WebSocket connection error. Disabling WebSocket");
        setUWebSocket(false);
        socket.disconnect();
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [uWebSocket]);

  return devJson;
}

export default useRedirectMap;
