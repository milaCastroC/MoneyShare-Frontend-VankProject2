import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  constructor(private api: ApiService) {}

  loginUsuario(credentials: { email: string; password: string }) {
    return this.api.post('/user/login', credentials);

  }
}
