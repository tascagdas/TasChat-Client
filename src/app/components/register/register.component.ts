import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterModel } from '../../Models/registermodel';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  register: RegisterModel = new RegisterModel();

  constructor(private http: HttpClient, private router: Router) {}

  handleRegister() {
    const formData = new FormData;
    this.http
      .post('http://localhost:5086/api/Auth/Register',formData)
      .subscribe((response) => {
        localStorage.setItem('accessToken', JSON.stringify(response));
        this.router.navigateByUrl('/login');
      });
  }
}
