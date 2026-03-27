import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChatService } from '../chat.service';
import { ChatConversation } from '../models/chat-conversation.model';
import { ChatSidebarComponent } from '../chat-sidebar/chat-sidebar.component';
import { ChatWindowComponent } from '../chat-window/chat-window.component';
import { CommonModule } from '@angular/common';
import { ChatComposerComponent } from '../chat-composer/chat-composer.component';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  standalone:true,
  imports:[ChatSidebarComponent,ChatWindowComponent , CommonModule , ChatComposerComponent],
  styleUrls: ['./chat-page.component.scss'],
})
export class ChatPageComponent implements OnInit, OnDestroy {
  selectedConversationId: string | null = null;
  selectedConversation: ChatConversation | null = null;

  private conversations: ChatConversation[] = [];
  private destroy$ = new Subject<void>();

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService
      .getConversationsStream()
      .pipe(takeUntil(this.destroy$))
      .subscribe(convs => (this.conversations = convs));
  }

  onConversationSelected(conversationId: string): void {
    this.selectedConversationId = conversationId;
    this.selectedConversation =
      this.conversations.find(c => c.id === conversationId) ?? null;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}