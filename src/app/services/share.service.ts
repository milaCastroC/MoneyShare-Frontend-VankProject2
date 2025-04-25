import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Share } from '../models/share.model';
import { Payment } from '../models/payment.model';

@Injectable({
  providedIn: 'root',
})
export class ShareService {
  constructor(private api: ApiService) {}

  fetchUserShares() {
    return this.api.get('/share/find-by-user');
  }

  createShare(shareData: any) {
    return this.api.post('/share/create', shareData)
  }

  updateShare(shareData: any) {
    return this.api.patch('/share/update', shareData);
  }

  modifyPercentages(idShare: number, percentages: any) {
    return this.api.patch(`/share/members/percentages/${idShare}`, percentages);
  }

  joinShare(code: any) {
    return this.api.post('/share/members/add', code);
  }

  findShareByCode(code: any) {
    return this.api.get(`/share/find/code/${code}`);
  }

  findShareById(id: any) {
    return this.api.get(`/share/find/${id}`);
  }

  findShareMemebers(idShare: number) {
    return this.api.get(`/share/members/all/${idShare}`)
  }

  makePayment(payment: Payment) {
    return this.api.patch('/share/payment', payment);
  }
  
}
