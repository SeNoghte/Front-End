import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import *as signalR from '@microsoft/signalr';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [DatePipe, CommonModule, FormsModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent {
  inputValue: string = '';
  showIcon: boolean = false;
  private hubConnection!: signalR.HubConnection;
  selectedGroup = "000ca2ec-d4f4-43d3-9490-4eb2f320b515";
  userId = "5b0e8556-70a7-4754-a548-4e246cd84bb5";
  sendingMessage: string = '';



  messages: Message[] = [

    {
      message: "سلام چطوری؟",
      senderName: "من",
      senderUserId: "11",
      dateTime: new Date(),
      isMe: true,
      profileImage: ""
    },
    {
      message: "سلامممممممم",
      senderName: "ناشناس",
      senderUserId: "12",
      dateTime: new Date(),
      isMe: false,
      profileImage: ""
    },

  ];

  constructor(
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.getMessages();
  }

  handleInputChange() {
    console.log(this.inputValue);
  }

  adjustInputWidth() {
    if (this.sendingMessage.length > 0) {
      this.showIcon = true;
    } else {
      this.showIcon = false;
    }
  }

  public hubInit() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('api.becheen.ir:7001/chatHub', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      }).build();

    this.hubConnection.start().then(() => {
      console.log('connection started');
      this.hubConnection
        .invoke('joinGroupHub', this.selectedGroup)
        .catch((err: any) => console.log(err));
    }).catch((err: any) => console.log(err));

    this.hubConnection.onclose(() => {
      console.log('try to re start connection');
      this.hubConnection.start().then(() => {
        console.log('connection re started');
      }).catch((err: any) => console.log(err));
    });

    this.hubConnection.on('NewMessage', (data: Message) => {
      let newMessage: Message = data;

      if (newMessage.senderUserId === this.userId) {
        newMessage.isMe = true;
      } else {
        newMessage.isMe = false;
      }
      this.messages.unshift(data);
    });
  }

  public stopConnection() {
    this.hubConnection.stop().then(() => {
      console.log('stopped');
    }).catch((err: any) => console.log(err));
  }

  getMessages() {
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjViMGU4NTU2LTcwYTctNDc1NC1hNTQ4LTRlMjQ2Y2Q4NGJiNSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6InphcmVpYW4uMTM4MUBnbWFpbC5jb20iLCJleHAiOjE3MzIyODI2OTAsImlzcyI6Imh0dHBzOi8vYmVjaGVlbi5pciIsImF1ZCI6Imh0dHBzOi8vYmVjaGVlbi5pciJ9.n1rnvciPRCoAEwXuYz0Xmzw3yGaJdo0xZjqvNtFwxeg'
    // });
    // this.messages = [];
    // this.http.post(`https://api.becheen.ir:7001/api/Group/GetGroupMessageList`, {
    //   groupId: this.selectedGroup,
    //   pageIndex: 1, pageSize: 1000
    // },{headers}).subscribe((res: any) => {
    //   this.hubInit();
    //   this.messages = res.data.reverse();
    // });
    this.hubInit();
    this.messages = [{
      message: "سلام چطوری؟",
      senderName: "من",
      senderUserId: "11",
      dateTime: new Date(),
      isMe: true,
      profileImage: ""
    },
    {
      message: "سلامممممممم",
      senderName: "ناشناس",
      senderUserId: "12",
      dateTime: new Date(),
      isMe: false,
      profileImage: ""
    },];

  }

  sendMessage() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjViMGU4NTU2LTcwYTctNDc1NC1hNTQ4LTRlMjQ2Y2Q4NGJiNSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6InphcmVpYW4uMTM4MUBnbWFpbC5jb20iLCJleHAiOjE3MzIyODI2OTAsImlzcyI6Imh0dHBzOi8vYmVjaGVlbi5pciIsImF1ZCI6Imh0dHBzOi8vYmVjaGVlbi5pciJ9.n1rnvciPRCoAEwXuYz0Xmzw3yGaJdo0xZjqvNtFwxeg'
    });
    let data = {
      text: this.sendingMessage,
      groupId: this.selectedGroup,
    }
    this.http.post(`https://api.becheen.ir:6001/api/Group/SendMessageToGroup`, data, {headers}).subscribe((res) => {
      this.sendingMessage = '';
    });
  }


}
export interface Message {
  message: string;
  senderName: string;
  dateTime: Date;
  isMe: boolean;
  profileImage: string;
  senderUserId: string;
}
