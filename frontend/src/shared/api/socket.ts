import { createContext, useContext } from 'react';

export interface SocketContextType {
  connect: (url: string) => WebSocket;
  disconnect: (url: string) => void;
}

export const SocketContext = createContext<SocketContextType | null>(null);

export const useSocketManager = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocketManager must be used within SocketProvider');
  return context;
};
