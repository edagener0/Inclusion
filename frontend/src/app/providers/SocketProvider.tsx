import { useCallback, useEffect, useRef } from 'react';

import { SocketContext } from '@/shared/api';

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const sockets = useRef<Map<string, WebSocket>>(new Map());

  const connect = useCallback((url: string) => {
    if (sockets.current.has(url)) {
      const existingSocket = sockets.current.get(url)!;
      if (
        existingSocket.readyState === WebSocket.OPEN ||
        existingSocket.readyState === WebSocket.CONNECTING
      ) {
        return existingSocket;
      }
    }

    const socketInstance = new WebSocket(url);
    sockets.current.set(url, socketInstance);

    socketInstance.onclose = () => {
      sockets.current.delete(url);
    };

    return socketInstance;
  }, []);

  const disconnect = useCallback((url: string) => {
    const socket = sockets.current.get(url);
    if (socket) {
      socket.close();
      sockets.current.delete(url);
    }
  }, []);

  useEffect(() => {
    return () => {
      sockets.current.forEach((s) => s.close());
      sockets.current.clear();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ connect, disconnect }}>{children}</SocketContext.Provider>
  );
};
