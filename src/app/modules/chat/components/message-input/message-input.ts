import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-message-input',
  standalone: false,
  templateUrl: './message-input.html',
  styleUrl: './message-input.scss',
})
export class MessageInput {
  message: string = '';

  @Output() sendMessage = new EventEmitter<string>();

  onSend() {
    const text = this.message.trim();
    if (!text) return;
    this.sendMessage.emit(text);
    this.message = '';
  }
}
