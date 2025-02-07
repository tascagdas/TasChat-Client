import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  userName: string = '';

  constructor(private http: HttpClient,
    private router: Router
  ) {
    
  }


  login() {
    this.http
      .get('https://localhost:7116/api/Auth/Login?userName=' + this.userName)
      .subscribe((response) => {
        localStorage.setItem('accessToken', JSON.stringify(response));
        this.router.navigateByUrl('/');
      });
  }
}
