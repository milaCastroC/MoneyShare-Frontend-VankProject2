import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ShareSplitService {
  constructor(private api: ApiService) {}

  countMemberByShare(idShare: number) {
    return this.api.get(`/share-split/count/${idShare}`);
  }

}