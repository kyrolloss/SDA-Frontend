import { ChatMessage, SenderRole } from './chat-message.model';


export interface ConversationParticipant {
  id: string;
  name: string;
  role: SenderRole;
  avatar?: string;
  isOnline?: boolean;
  lastSeenAt?: Date;
}

export interface ChatConversation {
  id: string;

  participants: ConversationParticipant[];

  lastMessage?: Pick<ChatMessage, 'id' | 'type' | 'content' | 'sentAt' | 'senderName'>;
  unreadCount: number;

  createdAt: Date;
  updatedAt: Date;

  // metadata اختياري حسب نوع المحادثة
  relatedAppointmentId?: string;  // لو المحادثة مرتبطة بـ appointment
}

// للـ SignalR incoming events
export interface ConversationUpdatedPayload {
  conversationId: string;
  unreadCount: number;
  lastMessage: ChatConversation['lastMessage'];
  updatedAt: Date;
}

export interface ParticipantStatusPayload {
  participantId: string;
  conversationId: string;
  isOnline: boolean;
  lastSeenAt?: Date;
}