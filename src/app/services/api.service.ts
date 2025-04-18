import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { environment } from '../../enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: environment.apiUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  get<T>(url: string, params?: any) {
    return this.axiosInstance.get<T>(url, { params }).then(res => res.data);
  }

  post<T>(url: string, body: any) {
    return this.axiosInstance.post<T>(url, body).then(res => res.data);
  }

  put<T>(url: string, body: any) {
    return this.axiosInstance.put<T>(url, body).then(res => res.data);
  }

  delete<T>(url: string) {
    return this.axiosInstance.delete<T>(url).then(res => res.data);
  }
}
