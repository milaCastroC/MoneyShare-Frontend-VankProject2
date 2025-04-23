import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  constructor(private api: ApiService) {}

  loginUsuario(credentials: { email: string; password: string }) {
    return this.api.post('/user/login', credentials);
  }

  registerUsuario(user: any) {
    return this.api.post('user/register', user);
  }

  getUsuarioById(id: number) {
    return this.api.get(`/user/${id}`);
  }

  getUsuarioByEmail(email: string) {
    return this.api.get(`/user/email/${email}`);
  }

  getTokenInfo(): { token: string | null, isAuthenticated: boolean, email?: string } {
    const token = localStorage.getItem('token');
    if (!token) {
      return {
        token: null,
        isAuthenticated: false
      };
    }

    try {
      const decodedToken: any = jwtDecode(token);
      return {
        token,
        isAuthenticated: true,
        email: decodedToken.userEmail
      };
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return {
        token,
        isAuthenticated: false
      };
    }
  }
}
