import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { meetingEvents, MeetingEventEmitter } from '../events/meetingEvents';

// Track user socket connections
const userSockets = new Map<string, string>(); // userId -> socketId

export function initializeSocket(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "http://localhost:3001", // Frontend URL
      methods: ["GET", "POST", "PATCH"]
    }
  });

  io.on('connection', (socket) => {
    console.log('🔌 User connected:', socket.id);

    // Handle user identification (mock authentication)
    socket.on('identify', (userId: string) => {
      userSockets.set(userId, socket.id);
      console.log(`🔐 User ${userId} identified with socket ${socket.id}`);
      console.log('👥 Current connected users:', Array.from(userSockets.keys()));
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      // Remove user from tracking
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          console.log(`❌ User ${userId} disconnected`);
          break;
        }
      }
      console.log('👥 Remaining connected users:', Array.from(userSockets.keys()));
    });
  });

  // Listen to meeting events and notify connected users
  meetingEvents.on(MeetingEventEmitter.MEETING_CANCELLED, (eventData) => {
    const { meetingId, userId } = eventData;
    const socketId = userSockets.get(userId);
    
    console.log(`🔥 Processing meeting cancelled event for user ${userId}, meeting ${meetingId}`);
    console.log(`👥 Looking for socket ID for user ${userId}:`, socketId);
    console.log(`🗺️  All connected users:`, Array.from(userSockets.entries()));
    
    if (socketId) {
      console.log(`📡 Notifying user ${userId} about cancelled meeting ${meetingId}`);
      io.to(socketId).emit('meeting:cancelled', {
        meetingId,
        message: 'One of your meetings has been cancelled',
        timestamp: new Date()
      });
      console.log(`✅ Notification sent to socket ${socketId}`);
    } else {
      console.log(`❌ User ${userId} not connected, skipping notification`);
    }
  });

  meetingEvents.on(MeetingEventEmitter.MEETING_CREATED, (eventData) => {
    const { meetingId, userId } = eventData;
    const socketId = userSockets.get(userId);
    
    if (socketId) {
      console.log(`Notifying user ${userId} about new meeting ${meetingId}`);
      io.to(socketId).emit('meeting:created', {
        meetingId,
        message: 'A new meeting has been created',
        timestamp: new Date()
      });
    }
  });

  return io;
}