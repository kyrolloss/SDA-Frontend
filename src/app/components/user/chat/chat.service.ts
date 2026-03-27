import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ChatConversation, ConversationParticipant } from './models/chat-conversation.model';
import { ChatMessage, IncomingMessagePayload, MessageStatus, MessageStatusUpdatePayload } from './models/chat-message.model';
import { environment } from '../../../../environments/environment.prod';

// ============================================================
// MOCK DATA
// ============================================================

const MOCK_PARTICIPANTS: ConversationParticipant[] = [
  { id: 'u1', name: 'Dr. Donia Ali', role: 'doctor', isOnline: true },
  { id: 'u2', name: 'Sara Mohamed', role: 'patient', isOnline: false, lastSeenAt: new Date('2026-03-27T10:00:00') },
  { id: 'u3', name: 'City Clinic', role: 'clinic', isOnline: true },
];

const MOCK_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'conv1',
    participants: [MOCK_PARTICIPANTS[0], MOCK_PARTICIPANTS[1]],
    unreadCount: 3,
    createdAt: new Date('2026-03-01'),
    updatedAt: new Date('2026-03-27'),
    lastMessage: {
      id: 'msg3',
      type: 'text',
      content: 'موعدك بكره الساعة 10',
      sentAt: new Date('2026-03-27T11:00:00'),
      senderName: 'Dr. Donia Ali',
    },
  },
  {
    id: 'conv2',
    participants: [MOCK_PARTICIPANTS[2], MOCK_PARTICIPANTS[1]],
    unreadCount: 0,
    createdAt: new Date('2026-03-10'),
    updatedAt: new Date('2026-03-26'),
    lastMessage: {
      id: 'msg8',
      type: 'file',
      content: undefined,
      sentAt: new Date('2026-03-26T09:00:00'),
      senderName: 'City Clinic',
    },
  },
];

const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  conv1: [
    {
      id: 'msg1',
      conversationId: 'conv1',
      senderId: 'u2',
      senderName: 'Sara Mohamed',
      senderRole: 'patient',
      type: 'text',
      content: 'السلام عليكم دكتور',
      status: 'read',
      sentAt: new Date('2026-03-27T10:00:00'),
    },
    {
      id: 'msg2',
      conversationId: 'conv1',
      senderId: 'u1',
      senderName: 'Dr. Donia Ali',
      senderRole: 'doctor',
      type: 'text',
      content: 'وعليكم السلام، إزيك؟',
      status: 'read',
      sentAt: new Date('2026-03-27T10:05:00'),
    },
    {
      id: 'msg3',
      conversationId: 'conv1',
      senderId: 'u1',
      senderName: 'Dr. Donia Ali',
      senderRole: 'doctor',
      type: 'text',
      content: 'موعدك بكره الساعة 10',
      status: 'delivered',
      sentAt: new Date('2026-03-27T11:00:00'),
    },
  ],
  conv2: [
    {
      id: 'msg8',
      conversationId: 'conv2',
      senderId: 'u3',
      senderName: 'City Clinic',
      senderRole: 'clinic',
      type: 'file',
      attachment: {
        id: 'att1',
        url: 'https://mock.url/report.pdf',
        name: 'تقرير طبي.pdf',
        size: 204800,
        mimeType: 'application/pdf',
        pageCount: 3,
      },
      status: 'read',
      sentAt: new Date('2026-03-26T09:00:00'),
    },
  ],
};

// ============================================================
// SERVICE
// ============================================================

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly apiUrl = `${environment.apiUrl}/chat`;
  private readonly useMock = true; // ← غيّرها false لما الباك يخلص

  // الـ active conversation اللي المستخدم فاتحها دلوقتي
  private activeConversationId$ = new BehaviorSubject<string | null>(null);

  // الـ messages بتاعة الـ active conversation
  private messages$ = new BehaviorSubject<ChatMessage[]>([]);

  // الـ conversations list
  private conversations$ = new BehaviorSubject<ChatConversation[]>([]);

  constructor(private http: HttpClient) {}

  // ─── Conversations ───────────────────────────────────────

  getConversations(): Observable<ChatConversation[]> {
    if (this.useMock) {
      this.conversations$.next(MOCK_CONVERSATIONS);
      return this.conversations$.asObservable();
    }
    return this.http.get<ChatConversation[]>(`${this.apiUrl}/conversations`);
  }

  getConversationsStream(): Observable<ChatConversation[]> {
    return this.conversations$.asObservable();
  }

  // ─── Messages ────────────────────────────────────────────

  loadMessages(conversationId: string): Observable<ChatMessage[]> {
    this.activeConversationId$.next(conversationId);

    if (this.useMock) {
      const msgs = MOCK_MESSAGES[conversationId] ?? [];
      this.messages$.next(msgs);
      return this.messages$.asObservable();
    }
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/conversations/${conversationId}/messages`);
  }

  getMessagesStream(): Observable<ChatMessage[]> {
    return this.messages$.asObservable();
  }

  // ─── Send Message ─────────────────────────────────────────

  sendTextMessage(conversationId: string, content: string, senderId: string): void {
    const newMsg: ChatMessage = {
      id: crypto.randomUUID(),
      conversationId,
      senderId,
      senderName: 'Me', // هيتعمل من الـ auth service بعدين
      senderRole: 'doctor',
      type: 'text',
      content,
      status: 'sending',
      sentAt: new Date(),
    };

    if (this.useMock) {
      this.appendMessage(newMsg);
      // simulate sent status after 500ms
      setTimeout(() => this.updateMessageStatus(newMsg.id, 'sent'), 500);
      return;
    }

    // TODO: إرسال عن طريق SignalR
    // this.signalRService.sendMessage(newMsg);
  }

  sendAttachmentMessage(conversationId: string, formData: FormData, senderId: string): Observable<ChatMessage> {
    // TODO: رفع الملف الأول على السيرفر وبعدين إرسال الـ message
    return this.http.post<ChatMessage>(`${this.apiUrl}/messages/attachment`, formData);
  }

  // ─── SignalR Handlers (هتتربط بيهم لما الباك يخلص) ────────

  handleIncomingMessage(payload: IncomingMessagePayload): void {
    const { message, conversationId } = payload;
    const activeId = this.activeConversationId$.getValue();

    if (activeId === conversationId) {
      this.appendMessage(message);
    }

    this.updateConversationLastMessage(conversationId, message);
  }

  handleStatusUpdate(payload: MessageStatusUpdatePayload): void {
    const messages = this.messages$.getValue();
    const updated = messages.map(m =>
      m.id === payload.messageId ? { ...m, status: payload.status } : m
    );
    this.messages$.next(updated);
  }

  // ─── Helpers ──────────────────────────────────────────────

  private appendMessage(message: ChatMessage): void {
    const current = this.messages$.getValue();
    this.messages$.next([...current, message]);
  }

  private updateMessageStatus(messageId: string, status: MessageStatus): void {
    const messages = this.messages$.getValue();
    const updated = messages.map(m => (m.id === messageId ? { ...m, status } : m));
    this.messages$.next(updated);
  }

  private updateConversationLastMessage(conversationId: string, message: ChatMessage): void {
    const convs = this.conversations$.getValue();
    const updated = convs.map(c =>
      c.id === conversationId
        ? {
            ...c,
            updatedAt: new Date(),
            lastMessage: {
              id: message.id,
              type: message.type,
              content: message.content,
              sentAt: message.sentAt,
              senderName: message.senderName,
            },
          }
        : c
    );
    this.conversations$.next(updated);
  }
}