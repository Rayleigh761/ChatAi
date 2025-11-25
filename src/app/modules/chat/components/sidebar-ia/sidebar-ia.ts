import { Component, EventEmitter, Output, Input, HostListener } from '@angular/core';

@Component({
  selector: 'app-sidebar-ia',
  standalone: false,
  templateUrl: './sidebar-ia.html',
  styleUrl: './sidebar-ia.scss',
})
export class SidebarIa {
  @Input() ias: { id: string; name: string }[] = [];
  @Input() active: string = '';
  @Output() select = new EventEmitter<string>();
  
  // Estado do sidebar
  isOpen = true;
  isMobile = false;
  
  // Dados de exemplo para conversas
  conversations = [
    { id: 1, preview: 'Como posso ajudar com...', time: '10:30' },
    { id: 2, preview: 'Sobre o projeto novo...', time: 'Ontem' },
    { id: 3, preview: 'Relatório mensal...', time: '12/12' }
  ];

  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile) {
      this.isOpen = false; // Fecha sidebar no mobile por padrão
    }
  }

  choose(iaId: string) {
    this.select.emit(iaId);
    if (this.isMobile) {
      this.toggle(); // Fecha sidebar após seleção no mobile
    }
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  newChat() {
    // Lógica para nova conversa
    console.log('Nova conversa iniciada');
    if (this.isMobile) {
      this.toggle(); // Fecha sidebar no mobile após nova conversa
    }
  }

  selectConversation(conversation: any) {
    // Lógica para selecionar conversa
    console.log('Conversa selecionada:', conversation);
    if (this.isMobile) {
      this.toggle(); // Fecha sidebar no mobile
    }
  }

  getAvatarIcon(iaId: string): string {
    const icons: { [key: string]: string } = {
      'diana': '👩‍💼',
      'hamilton': '👨‍🚀',
      'default': '🤖'
    };
    
    return icons[iaId] || icons['default'];
  }
}
