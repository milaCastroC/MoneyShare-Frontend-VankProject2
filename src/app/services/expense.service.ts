import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  constructor(private api: ApiService) {}

  getExpensesByShareId(shareId: string) {
    return this.api.get(`/expense/share/${shareId}`);
  }
}
