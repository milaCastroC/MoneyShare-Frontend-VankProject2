import { Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
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

    // Interceptor para añadir el token a todas las peticiones
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  get<T>(url: string, params?: any, config?: AxiosRequestConfig) {
    return this.axiosInstance.get<T>(url, { ...config, params }).then(res => res.data);
  }

  post<T>(url: string, body?: any, config?: AxiosRequestConfig) {
    return this.axiosInstance.post<T>(url, body, config).then(res => res.data);
  }

  put<T>(url: string, body: any, config?: AxiosRequestConfig) {
    return this.axiosInstance.put<T>(url, body, config).then(res => res.data);
  }

  delete<T>(url: string, config?: AxiosRequestConfig) {
    return this.axiosInstance.delete<T>(url, config).then(res => res.data);
  }

  patch<T>(url: string, body: any, config?: AxiosRequestConfig) {
    return this.axiosInstance.patch<T>(url, body, config).then(res => res.data);
  }

}