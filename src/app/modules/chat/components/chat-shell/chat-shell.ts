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
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
    
    // No desktop, sidebar começa aberto
    if (!this.isMobile) {
      this.sidebarOpen = false;
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
      status: 'read',
      timestamp: new Date().toISOString(),
    };

    this.messages.push(out);
    this.storage.set('chatHistory', this.messages);

    this.chatService.sendMessage(text, this.sessionId).subscribe(reply => {
      this.messages.push(reply);
      this.storage.set('chatHistory', this.messages);
    });
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
  }

  getActiveIaName(): string {
    const activeIa = this.iaList.find(ia => ia.id === this.activeIa);
    return activeIa ? activeIa.name : 'Assistente IA';
  }
}