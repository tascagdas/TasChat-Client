import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterModel } from '../../Models/register.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {

setImage(event : any) {
  this.registerModel.file = event.target.files[0];
}
  
  registerModel: RegisterModel = new RegisterModel();

  constructor(private http: HttpClient, private router: Router) {}

  handleRegister() {
    const formData = new FormData;

    formData.append('userName', this.registerModel.userName);
    formData.append('file',this.registerModel.file,this.registerModel.file.name)
    this.http
      .post('https  ://localhost:7116/api/Auth/Register', formData)
      .subscribe((response) => {
        localStorage.setItem('accessToken', JSON.stringify(response));
        this.router.navigateByUrl('/login');
      });
  }
}
