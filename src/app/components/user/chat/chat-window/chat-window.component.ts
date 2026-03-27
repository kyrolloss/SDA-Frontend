import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChatService } from '../chat.service';
import { ChatMessage } from '../models/chat-message.model';
import { ChatConversation } from '../models/chat-conversation.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  standalone:true,
  imports:[CommonModule],
  styleUrls: ['./chat-window.component.scss'],
})
export class ChatWindowComponent implements OnInit, OnChanges, OnDestroy, AfterViewChecked {
  @Input() conversationId: string | null = null;
  @Input() conversation: ChatConversation | null = null;

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  messages: ChatMessage[] = [];
  isLoading = false;
  private shouldScrollToBottom = false;

  // TODO: استبدل بالـ auth service
  readonly currentUserId = 'u1';

  private destroy$ = new Subject<void>();

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService
      .getMessagesStream()
      .pipe(takeUntil(this.destroy$))
      .subscribe(messages => {
        this.messages = messages;
        this.shouldScrollToBottom = true;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['conversationId']?.currentValue) {
      this.loadMessages(changes['conversationId'].currentValue);
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  loadMessages(conversationId: string): void {
    this.isLoading = true;
    this.chatService
      .loadMessages(conversationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => (this.isLoading = false));
  }

  isMyMessage(message: ChatMessage): boolean {
    return message.senderId === this.currentUserId;
  }

  // ─── Grouping ─────────────────────────────────────────────
  // بيجمع الرسائل اللي في نفس الدقيقة من نفس الشخص في group واحدة
  getMessageGroups(): { senderId: string; messages: ChatMessage[] }[] {
    const groups: { senderId: string; messages: ChatMessage[] }[] = [];
    for (const msg of this.messages) {
      const last = groups[groups.length - 1];
      if (last && last.senderId === msg.senderId) {
        last.messages.push(msg);
      } else {
        groups.push({ senderId: msg.senderId, messages: [msg] });
      }
    }
    return groups;
  }

  // ─── Helpers ──────────────────────────────────────────────

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatFileSize(bytes: number | undefined): string {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  getStatusIcon(message: ChatMessage): string {
    if (!this.isMyMessage(message)) return '';
    switch (message.status) {
      case 'sending':   return 'pi pi-clock';
      case 'sent':      return 'pi pi-check';
      case 'delivered': return 'pi pi-check-circle';
      case 'read':      return 'pi pi-check-circle status-read';
      case 'failed':    return 'pi pi-times-circle status-failed';
      default:          return '';
    }
  }

  downloadAttachment(url: string, name: string): void {
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
  }

  private scrollToBottom(): void {
    try {
      const el = this.messagesContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    } catch {}
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}