import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [DatePipe, CommonModule,FormsModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent {
  inputValue: string = '';
  showIcon: boolean = false;

  messages: Message[] = [
    
    {
      message: "سلام چطوری؟",
      senderName: "من",
      dateTime: new Date(),
      isMe: true,
      profileImage: ""
    },
    {
      message: "سلامممممممم",
      senderName: "ناشناس",
      dateTime: new Date(),
      isMe: false,
      profileImage: ""
    },

  ];

  handleInputChange() {
    console.log(this.inputValue); 
  }

  adjustInputWidth() {
    if (this.inputValue.length > 0) {
      this.showIcon = true;
    } else {
      this.showIcon = false;
    }
  }

  sendMessage() {
    console.log(this.inputValue);
  }
}
export interface Message {
  message: string;
  senderName: string;
  dateTime: Date;
  isMe: boolean;
  profileImage: string;
}
