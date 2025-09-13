import { Component } from '@angular/core';
import { MainNavbarComponent } from '../../shared/main-navbar/main-navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [MainNavbarComponent , RouterOutlet],
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.scss'
})
export class UserLayoutComponent {

}
