import { Injectable } from '@angular/core';
import { ApiService } from './api-service';
import { environment } from '../../../environments/environment';
import { Message } from '../models/message.model';
import { v4 as uuidv4 } from 'uuid';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  webhookUrl = environment.webhookUrl;

  constructor(private api: ApiService) {}

  sendMessage(text: string, sessionId?: string): Observable<Message> {
    const payload = {
      sessionId: sessionId || uuidv4(),
      text,
      timestamp: new Date().toISOString()
    };
    // envia para o webhook (n8n). Espera-se que o fluxo do n8n responda
    return this.api.post<any>(this.webhookUrl, payload).pipe(
    map(response => {
      const replyText = response?.output ?? 'Sem resposta do webhook';
      const msg: Message = {
        id: uuidv4(),
        text: replyText,
        type: 'received',
        status: 'received',
        timestamp: new Date().toISOString()
      };
      return msg;
    }),
    catchError(err => {
      console.error('Erro ao enviar para webhook', err);
      const errMsg: Message = {
        id: uuidv4(),
        text: 'Erro ao contatar o servidor.',
        type: 'system',
        status: 'read',  
        timestamp: new Date().toISOString()
      };
      return of(errMsg);
    })
    );  
  }
}
