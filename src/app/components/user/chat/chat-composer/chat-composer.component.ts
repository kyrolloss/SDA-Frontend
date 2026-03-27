import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChatService } from '../chat.service';
import { CommonModule } from '@angular/common';
export type AttachmentType = 'image' | 'file' | 'dicom' | 'voice';

@Component({
  selector: 'app-chat-composer',
  templateUrl: './chat-composer.component.html',
  standalone:true,
  imports:[CommonModule,FormsModule,ReactiveFormsModule],
  styleUrls: ['./chat-composer.component.scss'],
})
export class ChatComposerComponent implements OnInit, OnDestroy {
  @Input() conversationId: string | null = null;
  @Output() messageSent = new EventEmitter<void>();

  @ViewChild('textInput') textInputRef!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('imageInput') imageInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('dicomInput') dicomInputRef!: ElementRef<HTMLInputElement>;

  // TODO: استبدل بالـ auth service
  readonly currentUserId = 'u1';

  textControl = new FormControl('', [Validators.maxLength(2000)]);

  showAttachmentMenu = false;

  // Voice recording
  isRecording = false;
  recordingDuration = 0;
  private recordingInterval: any;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  // Sending state
  isSending = false;

  private destroy$ = new Subject<void>();

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {}

  // ─── Send Text ────────────────────────────────────────────

  sendText(): void {
    const content = this.textControl.value?.trim();
    if (!content || !this.conversationId || this.isSending) return;

    this.isSending = true;
    this.chatService.sendTextMessage(this.conversationId, content, this.currentUserId);
    this.textControl.reset();
    this.adjustTextareaHeight();
    this.isSending = false;
    this.messageSent.emit();
  }

  onEnterKey(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendText();
    }
  }

  // ─── Attachment Menu ──────────────────────────────────────

  toggleAttachmentMenu(): void {
    this.showAttachmentMenu = !this.showAttachmentMenu;
  }

  closeAttachmentMenu(): void {
    this.showAttachmentMenu = false;
  }

  selectAttachment(type: AttachmentType): void {
    this.closeAttachmentMenu();
    switch (type) {
      case 'image':
        this.imageInputRef.nativeElement.click();
        break;
      case 'file':
        this.fileInputRef.nativeElement.click();
        break;
      case 'dicom':
        this.dicomInputRef.nativeElement.click();
        break;
      case 'voice':
        this.startVoiceRecording();
        break;
    }
  }

  // ─── File Handlers ────────────────────────────────────────

  onImageSelected(event: Event): void {
    const file = this.getFile(event);
    if (!file || !this.conversationId) return;
    this.uploadAttachment(file, 'image');
  }

  onFileSelected(event: Event): void {
    const file = this.getFile(event);
    if (!file || !this.conversationId) return;
    this.uploadAttachment(file, 'file');
  }

  onDicomSelected(event: Event): void {
    const file = this.getFile(event);
    if (!file || !this.conversationId) return;
    this.uploadAttachment(file, 'dicom');
  }

  private getFile(event: Event): File | null {
    return (event.target as HTMLInputElement).files?.[0] ?? null;
  }

  private uploadAttachment(file: File, type: AttachmentType): void {
    if (!this.conversationId) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('conversationId', this.conversationId);

    this.chatService
      .sendAttachmentMessage(this.conversationId, formData, this.currentUserId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.messageSent.emit(),
        error: (err) => console.error('Upload failed:', err),
      });
  }

  // ─── Voice Recording ──────────────────────────────────────

  async startVoiceRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];
      this.isRecording = true;
      this.recordingDuration = 0;

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) this.audioChunks.push(e.data);
      };

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.sendVoiceMessage(blob);
        stream.getTracks().forEach((t) => t.stop());
      };

      this.mediaRecorder.start();

      this.recordingInterval = setInterval(() => {
        this.recordingDuration++;
        if (this.recordingDuration >= 120) {
          this.stopVoiceRecording(); // max 2 minutes
        }
      }, 1000);
    } catch {
      console.error('Microphone access denied');
    }
  }

  stopVoiceRecording(): void {
    if (!this.mediaRecorder || !this.isRecording) return;
    clearInterval(this.recordingInterval);
    this.isRecording = false;
    this.mediaRecorder.stop();
  }

  cancelVoiceRecording(): void {
    if (!this.mediaRecorder || !this.isRecording) return;
    clearInterval(this.recordingInterval);
    this.isRecording = false;
    this.mediaRecorder.ondataavailable = null;
    this.mediaRecorder.onstop = null;
    this.mediaRecorder.stop();
    this.audioChunks = [];
  }

  private sendVoiceMessage(blob: Blob): void {
    if (!this.conversationId) return;
    const file = new File([blob], `voice-${Date.now()}.webm`, { type: 'audio/webm' });
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'voice');
    formData.append('conversationId', this.conversationId);
    formData.append('duration', String(this.recordingDuration));

    this.chatService
      .sendAttachmentMessage(this.conversationId, formData, this.currentUserId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.messageSent.emit(),
        error: (err) => console.error('Voice upload failed:', err),
      });
  }

  formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  // ─── Textarea Auto-resize ─────────────────────────────────

  adjustTextareaHeight(): void {
    const el = this.textInputRef?.nativeElement;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 140) + 'px';
  }

  get canSend(): boolean {
    return !!this.textControl.value?.trim() && !this.isSending && !!this.conversationId;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    clearInterval(this.recordingInterval);
  }
}