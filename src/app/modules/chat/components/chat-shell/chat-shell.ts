import { Component,OnInit,Output, EventEmitter, HostListener } from '@angular/core';
import { Message } from '../../../../core/models/message.model';
import { ChatService } from '../../../../core/services/chat-service';
import { StorageService } from '../../../../core/services/storage-service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-chat-shell',
  standalone: false,
  templateUrl: './chat-shell.html',
  styleUrl: './chat-shell.scss',
})
export class ChatShell implements OnInit {

  messages: Message[] = [];
  sessionId: string;
  iaList = [
    { id: 'comandante-hamilton', name: 'Comandante Hamilton' },
    { id: 'diana', name: 'Diana' }
  ];
  activeIa = this.iaList[1].id;
  
  // Controle do sidebar responsivo
  isMobile = false;
  sidebarOpen = false;
  
  // Controle do tema
  isDarkMode = false;

  // Controle do estado de digitação
  isTyping = false;
  typingTimeout: any;


  constructor(
    private chatService: ChatService,
    private storage: StorageService
  ) {
    this.sessionId = this.storage.get('sessionId') || uuidv4();
    this.storage.set('sessionId', this.sessionId);
  }

  ngOnInit() {
    const saved = this.storage.get('chatHistory');
    if (saved) this.messages = saved;
    this.checkScreenSize();
    this.loadThemePreference();
    
    // Inicializa o sidebar baseado no tamanho da tela
    this.sidebarOpen = !this.isMobile;
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
    
    // No desktop: sidebar aberto | No mobile: sidebar fechado
    this.sidebarOpen = !this.isMobile;
    
    // Garante que o scroll do body esteja liberado no mobile
    if (this.isMobile) {
      document.body.style.overflow = '';
    }
  }

  // Carrega preferência de tema do localStorage
  private loadThemePreference() {
    const savedTheme = this.storage.get('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
    } else if (savedTheme === 'light') {
      this.isDarkMode = false;
    } else {
      // Se não há preferência salva, usa a preferência do sistema
      this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    this.applyTheme();
  }

  // Aplica o tema atual ao documento
  private applyTheme() {
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
    } else {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
    }
    
    // Também aplica ao body para garantir
    document.body.classList.toggle('dark-theme', this.isDarkMode);
    document.body.classList.toggle('light-theme', !this.isDarkMode);
  }

  // Alterna entre temas
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    
    // Salva a preferência
    this.storage.set('theme', this.isDarkMode ? 'dark' : 'light');
    
    console.log('Tema alterado para:', this.isDarkMode ? 'dark' : 'light');
  }

  onSend(text: string) {
    if (!text) return;

    const out: Message = {
      id: uuidv4(),
      text,
      type: 'sent',
      timestamp: new Date().toISOString(),
    };

    this.messages.push(out);
    this.storage.set('chatHistory', this.messages);

    // Mostra indicador de digitando
    this.showTypingIndicator();

    this.chatService.sendMessage(text, this.sessionId).subscribe({
      next: (reply) => {
        // Remove o indicador de digitando
        this.hideTypingIndicator();
        
        // Adiciona a resposta
        this.messages.push(reply);
        this.storage.set('chatHistory', this.messages);
      },
      error: (error) => {
        // Remove o indicador em caso de erro
        this.hideTypingIndicator();
        
        // Adiciona mensagem de erro
        const errorMessage: Message = {
          id: uuidv4(),
          text: 'Desculpe, ocorreu um erro. Tente novamente.',
          type: 'received',
          timestamp: new Date().toISOString(),
          sender: 'system'
        };
        this.messages.push(errorMessage);
        this.storage.set('chatHistory', this.messages);
        
        console.error('Erro ao enviar mensagem:', error);
      }
    });
  }

  // Método para mostrar indicador de digitando
  private showTypingIndicator() {
    // Remove qualquer indicador existente
    this.hideTypingIndicator();
    
    // Adiciona novo indicador
    const typingMessage: Message = {
      id: 'typing-indicator',
      text: '',
      type: 'typing',
      timestamp: new Date().toISOString(),
      sender: this.activeIa
    };
    
    this.messages.push(typingMessage);
    this.isTyping = true;
  }

  // Método para remover indicador de digitando
  private hideTypingIndicator() {
    this.messages = this.messages.filter(msg => msg.id !== 'typing-indicator');
    this.isTyping = false;
    
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
  }

  // Simula tempo de digitação (opcional)
  private simulateTyping(duration: number = 2000) {
    this.typingTimeout = setTimeout(() => {
      this.hideTypingIndicator();
    }, duration);
  }


  selectIa(id: string) {
    this.activeIa = id;
    if (this.isMobile) {
      this.toggleSidebar();
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    
    if (this.isMobile) {
      document.body.style.overflow = this.sidebarOpen ? 'hidden' : '';
    }
    
    // No desktop, você pode querer salvar a preferência do usuário
    if (!this.isMobile) {
      this.storage.set('sidebarCollapsed', !this.sidebarOpen);
    }
  }

  getActiveIaName(): string {
    const activeIa = this.iaList.find(ia => ia.id === this.activeIa);
    return activeIa ? activeIa.name : 'Assistente IA';
  }
}