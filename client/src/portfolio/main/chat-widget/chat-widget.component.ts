import { Component, DestroyRef, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChatMessage, PortfolioData } from '../../data/portfolio.models';
import { PortfolioService } from '../../data/portfolio.service';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-widget.component.html',
  styleUrl: './chat-widget.component.scss',
})
export class ChatWidgetComponent {
  @Input() portfolio!: PortfolioData;

  private readonly portfolioService = inject(PortfolioService);
  private readonly destroyRef = inject(DestroyRef);

  private static readonly MAX_HISTORY = 8;

  isOpen = false;
  draft = '';
  isSending = false;
  messages: ChatMessage[] = [];

  readonly suggestions = [
    "What's your current role?",
    'What projects have you built?',
    "What's your tech stack?",
    'How can I contact you?',
  ];

  toggleOpen(): void {
    this.isOpen = !this.isOpen;

    if (this.isOpen && this.messages.length === 0) {
      const firstName = this.portfolio?.personal?.name?.split(' ')[0] ?? 'my';
      this.messages.push({
        role: 'assistant',
        content: `Hi! I'm an AI assistant briefed on ${firstName}'s resume and portfolio. Ask me about his experience, skills, or projects.`,
      });
    }
  }

  closeChat(): void {
    this.isOpen = false;
  }

  sendSuggestion(text: string): void {
    this.draft = text;
    this.send();
  }

  send(): void {
    const text = this.draft.trim();
    if (!text || this.isSending) {
      return;
    }

    const history = this.messages.slice(-ChatWidgetComponent.MAX_HISTORY);

    this.messages.push({ role: 'user', content: text });
    this.draft = '';
    this.isSending = true;

    this.portfolioService
      .sendChatMessage({ message: text, history })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.messages.push({ role: 'assistant', content: response.reply });
          this.isSending = false;
        },
        error: (error: HttpErrorResponse) => {
          this.messages.push({
            role: 'assistant',
            content:
              error.error?.message ||
              "Sorry, I couldn't reach the assistant right now. Please try again in a moment, or use the contact form below.",
          });
          this.isSending = false;
        },
      });
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }
}
