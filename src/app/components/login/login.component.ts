import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] 
})

export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}
 ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    const credentials = this.loginForm.value;

    this.usuarioService.loginUsuario(credentials)
      .then((response: any) => {
        console.log('Login exitoso:', response);

        // Guardar token si se recibe uno
        if (response.token) {
          localStorage.setItem('token', response.token);
        }

        // Redirigir al home o dashboard
        this.router.navigate(['/home']);
      })
      .catch(error => {
        console.error('Error en login:', error);
        this.errorMessage = 'Credenciales inválidas o error en el servidor';
      });
  }
}
