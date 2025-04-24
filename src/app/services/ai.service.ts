import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AiService {
  constructor(private api: ApiService) {}

  sendMessage(message: string) {
    return this.api.post('/ai-chat/send-message', { message: message });
  }

  deleteHistory() {
    return this.api.delete('/ai-chat/delete-history');
  }
}
