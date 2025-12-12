import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    TranslateModule,
    MatIcon,
    RouterLink,
    CommonModule
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent {

  sideBar=false;

  openDetails() {
    this.sideBar = true;
  }

  
  closeDetails() {
    this.sideBar = false;
  }

}
