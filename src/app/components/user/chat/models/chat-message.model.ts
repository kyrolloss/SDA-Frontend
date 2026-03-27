export type MessageType = 'text' | 'image' | 'file' | 'dicom' | 'voice';

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export type SenderRole = 'patient' | 'doctor' | 'clinic';

export interface MessageAttachment {
  id: string;
  url: string;
  name: string;
  size?: number;         // bytes
  mimeType?: string;
  thumbnailUrl?: string; // للـ images و dicom
  duration?: number;     // للـ voice (بالثواني)
  pageCount?: number;    // للـ PDF
}

export interface ChatMessage {
  id: string;
  conversationId: string;

  senderId: string;
  senderName: string;
  senderRole: SenderRole;
  senderAvatar?: string;

  type: MessageType;
  content?: string;          // موجود لو type = 'text'
  attachment?: MessageAttachment; // موجود لو type != 'text'

  status: MessageStatus;
  sentAt: Date;
  deliveredAt?: Date;
  readAt?: Date;

  isDeleted?: boolean;
  replyTo?: string;          // id الـ message اللي بيرد عليها
}

// للـ SignalR incoming events
export interface IncomingMessagePayload {
  message: ChatMessage;
  conversationId: string;
}

export interface MessageStatusUpdatePayload {
  messageId: string;
  conversationId: string;
  status: MessageStatus;
  updatedAt: Date;
}