import { Component } from '@angular/core';
import { HomeComponentComponent } from "../../public/home/home-component.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [HomeComponentComponent,RouterOutlet],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss'
})
export class PublicLayoutComponent {

}
