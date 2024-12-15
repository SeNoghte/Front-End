import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { EventsComponent } from "./events/events.component";
import { MessagesComponent } from './messages/messages.component';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GetGroupMessageListRequest, GetGroupMessageListResult, GetGroupResponse, Group, Message } from '../shared/models/group-model-type';
import * as signalR from '@microsoft/signalr';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-group-chat',
    standalone: true,
    imports: [MatToolbarModule, MatIconModule, MatTabsModule, EventsComponent, MessagesComponent, HttpClientModule, CommonModule],
    templateUrl: './group-chat.component.html',
    styleUrl: './group-chat.component.scss'
})
export class GroupChatComponent implements OnInit {

    messages: Message[] = [];
    group!: Group;
    isLoading:boolean = true;

    constructor(private route: ActivatedRoute, private http: HttpClient,
        private toastrService: ToastrService
    ) { }

    ngOnInit(): void {
        this.GetGroupInfo();
    }

    GetGroupInfo() {
        this.route.queryParams.subscribe((params) => {
            let groupId = params['id'];

            const apiUrl = 'https://api.becheen.ir:6001/api/Group/GetGroup';
            let model = { groupId: groupId };

            this.http.post<GetGroupResponse>(apiUrl, model)
                .subscribe(
                    {
                        next: response => {
                            if (response.success) {
                                this.group = response.group;
                            } else {
                                this.toastrService.error(response.message);
                            }
                            this.isLoading = false;
                        },
                        error: error => {
                            this.toastrService.error('مشکلی پیش آمد');
                        }
                    }
                );

        });
    }


}

