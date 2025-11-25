import { Component, Input, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { Message } from '../../../../core/models/message.model';

@Component({
  selector: 'app-message-list',
  standalone: false,
  templateUrl: './message-list.html',
  styleUrl: './message-list.scss',
})
export class MessageList implements AfterViewChecked{
  @Input() messages: Message[] = [];
  @ViewChild('end') endEl!: ElementRef;

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    try {
      this.endEl.nativeElement.scrollIntoView({ behavior: 'smooth' });
    } catch (e) {
      // Fallback silencioso
    }
  }

  // Método para obter ícone do avatar baseado no sender da mensagem
  getAvatarIcon(message: Message): string {
    const icons: { [key: string]: string } = {
      'diana': '👩‍💼',
      'hamilton': '👨‍🚀', 
      'system': '⚡',
      'default': '🤖'
    };
    
    const sender = (message as any).sender || message.type;
    return icons[sender] || icons['default'];
  }

  // Método para formatar o timestamp
  getMessageTime(timestamp?: any): string {
    if (!timestamp) return 'Agora';
    
    try {
      if (timestamp instanceof Date) {
        return timestamp.toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      }
      
      // Se for string ou number, tenta converter
      const date = new Date(timestamp);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      }
    } catch (e) {
      console.warn('Erro ao formatar timestamp:', e);
    }
    
    return 'Agora';
  }
}
