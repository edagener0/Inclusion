import { useEffect, useMemo } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { useSocketManager } from '@/shared/api';
import { API_URL } from '@/shared/config';

import { conversationbQueries } from '../api/queries';
import type { Message } from './schema';

export function useConversationSocket(userId: number) {
  const queryClient = useQueryClient();
  const { connect, disconnect } = useSocketManager();

  const socketUrl = useMemo(() => {
    const wsBaseUrl = API_URL.replace(/^http/, 'ws');
    return `${wsBaseUrl}/ws/dms/${userId}/`;
  }, [userId]);

  useEffect(() => {
    const socket = connect(socketUrl);
    const queryKey = conversationbQueries.messages(userId).queryKey;

    const handleCreated = (newMessage: Message) => {
      queryClient.setQueryData(queryKey, (oldData) => {
        if (!oldData || !oldData.pages) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page, index: number) => {
            if (index === 0) {
              return {
                ...page,
                data: [newMessage, ...page.data],
              };
            }
            return page;
          }),
        };
      });
    };

    const handleUpdated = (updatedMessage: Message) => {
      queryClient.setQueryData(queryKey, (oldData) => {
        if (!oldData || !oldData.pages) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data.map((msg: Message) =>
              msg.id === updatedMessage.id ? { ...msg, ...updatedMessage } : msg,
            ),
          })),
        };
      });
    };

    const handleDeleted = (deletedMessageId: number) => {
      queryClient.setQueryData(queryKey, (oldData) => {
        if (!oldData || !oldData.pages) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data.filter((msg: Message) => msg.id !== deletedMessageId),
          })),
        };
      });
    };

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case 'dm.message.created':
            handleCreated(data.message);
            break;
          case 'dm.message.updated':
            handleUpdated(data.message);
            break;
          case 'dm.message.deleted':
            handleDeleted(data.message.id);
            break;
          default:
            break;
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    socket.addEventListener('message', handleMessage);

    return () => {
      socket.removeEventListener('message', handleMessage);
      disconnect(socketUrl);
    };
  }, [userId, queryClient, connect, disconnect, socketUrl]);
}
