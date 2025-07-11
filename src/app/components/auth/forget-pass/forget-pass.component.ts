import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forget-pass',
  standalone: true,
  imports: [
    TranslateModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './forget-pass.component.html',
  styleUrl: './forget-pass.component.scss'
})
export class ForgetPassComponent {
  showForget = false;
  showVerify = true;
  showReset = false;
  showResetSuccess = false;
  codes: number[] = [1,2,3,4,5,6]
  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  ngOnInit(): void {
    
    
  }
  backToForget(){
    this.showForget = true;
    this.showVerify = false;
  }
  goToReset(){
    this.showForget = false;
    this.showVerify = true;
  }
  goToResetSuccess(){

  }
}
