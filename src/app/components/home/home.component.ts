import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { UserModel } from '../../Models/user.model';
import { ChatModel } from '../../Models/chat.model';
import * as signalR from '@microsoft/signalr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {

  sendMessage() {
    const data = {
      "fromUserId" : this.user.id,
      "toUserId": this.selectedUserId,
      "message" : this.message
    }
    this.http.post<ChatModel>('https://localhost:7116/api/Chats/SendMessage', data)
      .subscribe((resp) => {
        this.chats.push(resp);
        this.message = "";
      });
  }

  users :UserModel[] = [];
  chats :ChatModel[] = [];
  selectedUserId: string = '';
  selectedUser: UserModel = new UserModel();
  user = new UserModel();
  hub: signalR.HubConnection | undefined;
  message: string = "";

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

    this.hub?.on("Messages", (resp: ChatModel) => {
      console.log(resp)
      if (this.selectedUserId == resp.fromUserId) {
        this.chats.push(resp)
      }
    })
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
    this.http.get(`https://localhost:7116/api/Chats/GetUserChats?fromUserId=${this.user.id}§toUserId=${this.selectedUserId}`)
      .subscribe((resp: any) => {
        this.chats = resp
    }
    )
  }
}
