import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { flags } from '../config/flags.js';

function useRedirectMap() {
    const [devJson, setDevJson] = useState({
        components: {},
        data: {},
    });
    const [uWebSocket, setUWebSocket] = useState(flags.enableHotReload);

    useEffect(() => {
        if (uWebSocket) {
            const socket = io(flags.bosLoaderWs, {
                reconnectionAttempts: 1 // Limit reconnection attempts
            });

            socket.on('fileChange', (d) => {
                console.log('File change detected via WebSocket', d);
                setDevJson(d);
            });

            socket.on('connect_error', () => {
                console.warning('WebSocket connection error. Switching to HTTP.');
                setUWebSocket(false);
                socket.disconnect();
            });

            return () => {
                socket.disconnect();
            };
        } else {
            fetch(flags.bosLoaderUrl)
                .then((r) => r.json())
                .then((d) => {
                    console.log('File change detected via HTTP', d);
                    setDevJson(d);
                })
                .catch((error) => {
                    console.error('HTTP request failed:', error);
                });
        }
    }, [uWebSocket]);

    return devJson;
}


export default useRedirectMap;
