"use client";

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (userId: string) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    console.log('🔌 Initializing socket connection for user:', userId);
    
    // Initialize socket connection
    socketRef.current = io('http://localhost:3000', {
      transports: ['websocket', 'polling']
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('✅ Connected to server:', socket.id);
      // Identify user to server
      console.log('🔐 Identifying user to server:', userId);
      socket.emit('identify', userId);
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
    });

    socket.on('connect_error', (error) => {
      console.log('🚨 Connection error:', error);
    });

    // Debug: Log all socket events
    socket.onAny((event, ...args) => {
      console.log(`📡 Socket event received: ${event}`, args);
    });

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [userId]);

  const onMeetingCancelled = (callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on('meeting:cancelled', callback);
    }
  };

  const onMeetingCreated = (callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on('meeting:created', callback);
    }
  };

  const offMeetingCancelled = () => {
    if (socketRef.current) {
      socketRef.current.off('meeting:cancelled');
    }
  };

  const offMeetingCreated = () => {
    if (socketRef.current) {
      socketRef.current.off('meeting:created');
    }
  };

  return {
    socket: socketRef.current,
    onMeetingCancelled,
    onMeetingCreated,
    offMeetingCancelled,
    offMeetingCreated
  };
};