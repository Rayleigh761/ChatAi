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
  @Input() isOpen: boolean = true; // RECEBE estado do pai
  @Output() select = new EventEmitter<string>();
  @Output() toggle = new EventEmitter<void>(); // EMITE para o pai
  
  
  // Dados de exemplo para conversas
  conversations = [
    { id: 1, preview: 'Como posso ajudar com...', time: '10:30' },
    { id: 2, preview: 'Sobre o projeto novo...', time: 'Ontem' },
    { id: 3, preview: 'Relatório mensal...', time: '12/12' }
  ];

  choose(iaId: string) {
    this.select.emit(iaId);
    // Emite toggle para fechar no mobile (o pai decide se fecha)
    this.toggle.emit();
  }

  newChat() {
    // Lógica para nova conversa
    console.log('Nova conversa iniciada');
    // Emite toggle para fechar no mobile
    this.toggle.emit();
  }

  selectConversation(conversation: any) {
    // Lógica para selecionar conversa
    console.log('Conversa selecionada:', conversation);
    // Emite toggle para fechar no mobile
    this.toggle.emit();
  }

  getAvatarIcon(iaId: string): string {
    const icons: { [key: string]: string } = {
      'diana': '👩‍💼',
      'hamilton': '👨‍🚀',
      'default': '🤖'
    };
    
    return icons[iaId] || icons['default'];
  }

  onToggle() {
    this.toggle.emit();
  }
  
}
