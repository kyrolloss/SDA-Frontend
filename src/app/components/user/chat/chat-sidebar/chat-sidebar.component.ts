import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { ChatService } from '../chat.service';
import { ChatConversation } from '../models/chat-conversation.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-chat-sidebar',
  standalone: true,   
  imports: [CommonModule, ReactiveFormsModule, RouterModule], 
  templateUrl: './chat-sidebar.component.html',
  styleUrls: ['./chat-sidebar.component.scss'],
})
export class ChatSidebarComponent implements OnInit, OnDestroy {
  @Output() conversationSelected = new EventEmitter<string>();

  conversations: ChatConversation[] = [];
  filteredConversations: ChatConversation[] = [];
  selectedConversationId: string | null = null;

  searchControl = new FormControl('');

  private destroy$ = new Subject<void>();

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    // تحميل المحادثات
    this.chatService
      .getConversations()
      .pipe(takeUntil(this.destroy$))
      .subscribe(convs => {
        this.conversations = convs;
        this.filteredConversations = convs;
      });

    // الـ search مع debounce
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(query => this.filterConversations(query ?? ''));
  }

  selectConversation(conversationId: string): void {
    this.selectedConversationId = conversationId;
    this.conversationSelected.emit(conversationId);
  }

  getOtherParticipantName(conv: ChatConversation): string {
    // بيرجع اسم الطرف التاني (مش الـ current user)
    // TODO: استبدل 'currentUserId' بالـ id الحقيقي من الـ auth service
    const currentUserId = 'u1';
    const other = conv.participants.find(p => p.id !== currentUserId);
    return other?.name ?? 'Unknown';
  }

  getOtherParticipantAvatar(conv: ChatConversation): string | undefined {
    const currentUserId = 'u1';
    return conv.participants.find(p => p.id !== currentUserId)?.avatar;
  }

  isOtherParticipantOnline(conv: ChatConversation): boolean {
    const currentUserId = 'u1';
    return conv.participants.find(p => p.id !== currentUserId)?.isOnline ?? false;
  }

  getLastMessagePreview(conv: ChatConversation): string {
    if (!conv.lastMessage) return '';
    switch (conv.lastMessage.type) {
      case 'text':   return conv.lastMessage.content ?? '';
      case 'image':  return '📷 صورة';
      case 'file':   return '📄 ملف';
      case 'dicom':  return '🩻 DICOM';
      case 'voice':  return '🎤 رسالة صوتية';
      default:       return '';
    }
  }

  formatTime(date: Date | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) {
      return d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString('ar-EG', { day: '2-digit', month: '2-digit' });
  }

  private filterConversations(query: string): void {
    if (!query.trim()) {
      this.filteredConversations = this.conversations;
      return;
    }
    const lower = query.toLowerCase();
    this.filteredConversations = this.conversations.filter(conv =>
      conv.participants.some(p => p.name.toLowerCase().includes(lower)) ||
      conv.lastMessage?.content?.toLowerCase().includes(lower)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}