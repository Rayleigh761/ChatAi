import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatShell } from './components/chat-shell/chat-shell';
import { MessageList } from './components/message-list/message-list';
import { MessageInput } from './components/message-input/message-input';
import { SidebarIa } from './components/sidebar-ia/sidebar-ia';


@NgModule({
  declarations: [
    ChatShell,
    MessageList,
    MessageInput,
    SidebarIa
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    ChatShell
  ]
})
export class ChatModule { }
