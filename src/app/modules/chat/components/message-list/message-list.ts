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

  // Método para copiar texto para a área de transferência
  async copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      this.showCopyFeedback();
    } catch (err) {
      // Fallback para navegadores mais antigos
      this.fallbackCopyToClipboard(text);
    }
  }

  // Método fallback para copiar
  private fallbackCopyToClipboard(text: string) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      this.showCopyFeedback();
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
    
    document.body.removeChild(textArea);
  }

  // Mostrar feedback visual de cópia
  private showCopyFeedback() {
    // Você pode implementar um toast notification aqui
    console.log('Texto copiado para a área de transferência!');
    
    // Feedback visual temporário nos botões
    const buttons = document.querySelectorAll('.copy-btn');
    buttons.forEach(btn => {
      btn.classList.add('copied');
      setTimeout(() => {
        btn.classList.remove('copied');
      }, 1000);
    });
  }
  
}
