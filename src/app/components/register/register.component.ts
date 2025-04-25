// register.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../models/user.model';
import { UsuarioService } from '../../services/usuario.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']

})

export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      nombre: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]],
      usuario: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20),
        Validators.pattern('^[a-zA-Z0-9._-]*$')
      ]],
      contrasena: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=[\\]{};\'"\\\\|,.<>/?]).{8,}$')
      ]],
      correo: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
      ]],
      telefono: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{10}$')
      ]]
    });
  }

  // Getter para facilitar el acceso a los campos del formulario
  get f() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    // Detener si el formulario es inválido
    if (this.registerForm.invalid) {
      return;
    }

    const user: User = {
      name: this.registerForm.value.nombre,
      username: this.registerForm.value.usuario,
      password: this.registerForm.value.contrasena,
      email: this.registerForm.value.correo,
      tel: this.registerForm.value.telefono
    };

    this.usuarioService.registerUsuario(user)
      .then((response: any) => {
        console.log('registro exitoso:', response);
        this.notificationService.createWelcomeNotification(user.email)
        this.router.navigate(['/login']);
      })
      .catch(error => {
        console.error('Error en login:', error);
      });

  }
}