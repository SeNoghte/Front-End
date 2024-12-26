import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import *as signalR from '@microsoft/signalr';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GetGroupMessageListRequest, GetGroupMessageListResult, Group, Message, SendMessageToGroupRequest } from '../../shared/models/group-model-type';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [DatePipe, CommonModule, FormsModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent implements OnInit, OnDestroy {
  inputValue: string = '';
  showIcon: boolean = false;
  private hubConnection!: signalR.HubConnection;
  sendingMessage: string = '';
  isLoading: boolean = true;
  currentUserId: string = '';
  messages: Message[] = [];
  @Input() group!: Group;

  constructor(private http: HttpClient, private toastrService: ToastrService
  ) { }

  ngOnDestroy(): void {
    this.hubConnection.invoke('LeaveGroup', this.group.id).catch((err) => console.error(err));
  }

  ngOnInit() {
    this.hubInit();
    this.InitCurrentUserId();
  }

  InitCurrentUserId() {
    let url = "https://api.becheen.ir:6001/api/User/Profile";

    this.http.post<any>(url, {}).subscribe((res) => {
      if (res.success) {
        this.currentUserId = res.user.userId;
        this.GetMessages();
      }
      else {
        this.toastrService.error(res.message);
      }
    })
  }

  adjustInputWidth() {
    if (this.sendingMessage && this.sendingMessage != '') {
      this.showIcon = true;
    } else {
      this.showIcon = false;
    }
  }

  public hubInit() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://api.becheen.ir:6001/chatHub', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .build();

    this.hubConnection.start().then(() => {
      console.log('connection started');
      this.hubConnection.invoke('JoinGroup', this.group.id).catch((err) => console.error(err));
    }).catch(err => console.log(err));

    this.hubConnection.on('ReceiveMessage', (message) => {
      console.log(message);

      message.isMe = message.userId == this.currentUserId;
      this.messages.unshift(message);
    });
  }

  public GetMessages() {
    let model: GetGroupMessageListRequest = { groupId: this.group.id, pageIndex: 1, pageSize: 1000 };

    let url = 'https://api.becheen.ir:6001/api/Group/GetGroupMessageList'

    this.http.post<GetGroupMessageListResult>(url, model).subscribe({
      next: res => {
        if (res.success) {
          this.messages = res.items;

          this.messages.forEach(x => x.isMe = x.userId == this.currentUserId);
        }
        else {
          this.toastrService.error(res.message);
        }
        this.isLoading = false;
      },
      error: error => {
        this.toastrService.error('مشکلی پیش آمد');
        this.isLoading = false;
      }
    })
  }

  public stopConnection() {
    this.hubConnection.stop().then(() => {
      console.log('stopped');
    }).catch((err: any) => console.log(err));
  }

  sendMessage() {
    let data: SendMessageToGroupRequest = { groupId: this.group.id, text: this.sendingMessage };

    this.http.post<any>(environment.apiUrl + `/Group/SendMessageToGroup`, data).subscribe({
      next: res => {
        if (res.success) {
          this.sendingMessage = '';
        }
        else {
          this.toastrService.error(res.message);
        }
      },
      error: error => {
        this.toastrService.error('مشکلی پیش آمد');
      }
    });
  }

}
