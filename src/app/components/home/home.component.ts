import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { UserModel } from '../../Models/user.model';
import { ChatModel } from '../../Models/chat.model';
import * as signalR from '@microsoft/signalr';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {

  users :UserModel[] = [];
  chats :ChatModel[] = [];
  selectedUserId: string = '';
  selectedUser: UserModel = new UserModel();
  user = new UserModel();
  hub: signalR.HubConnection | undefined;

  constructor(
    private http: HttpClient
  ) {
    this.user = JSON.parse(localStorage.getItem('accessToken') ?? "")
    this.getUsers();



    this.hub = new signalR.HubConnectionBuilder().withUrl('https://localhost:7116/chat-hub').build();

    this.hub.start().then(() => {
      console.log("hub bağlantısı sağlandı.")


      this.hub?.invoke("Connect", this.user.id)
      
      this.hub?.on("Users", (resp:UserModel) => {
        console.log(resp)
        this.users.find(u => u.id == resp.id)!.status=resp.status
      })
    });
    console.log(this.users)
  }
  logout() {

    localStorage.clear();
    document.location.reload();
  }

  getUsers() {
    this.http
      .get<UserModel[]>('https://localhost:7116/api/Chats/GetUsers')
      .subscribe((r) => (this.users = r.filter((u) => u.id != this.user.id)));
  }



  changeUser(user: UserModel) {
    this.selectedUserId = user.id;
    this.selectedUser = user;

    // this.chats = Chats.filter(
    //   (p) =>
    //     (p.toUserId == user.id && p.userId == '0') ||
    //     (p.userId == user.id && p.toUserId == '0')
    // );
  }
}
