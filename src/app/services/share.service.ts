import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ShareService {
  constructor(private api: ApiService) {}

  fetchUserShares() {
    return this.api.get('/share/find-by-user');
  }

}
