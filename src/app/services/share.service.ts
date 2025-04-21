import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Share } from '../models/share.model';

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

  joinShare(code: any) {
    return this.api.post('/share/members/add', code);
  }

  findShareByCode(code: any) {
    return this.api.get(`/share/find/code/${code}`);
  }

  findShareById(id: any) {
    return this.api.get(`/share/find/${id}`);
  }
  
}
