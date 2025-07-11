import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from "./components/auth/login/login.component";
import { RegisterComponent } from "./components/auth/register/register.component";
import { ForgetPassComponent } from "./components/auth/forget-pass/forget-pass.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, RegisterComponent, ForgetPassComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'SDA';
}