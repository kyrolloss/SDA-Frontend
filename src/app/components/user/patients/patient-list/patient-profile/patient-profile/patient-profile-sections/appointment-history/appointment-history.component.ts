import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-appointment-history',
  standalone: true,
  imports: [TranslateModule,MatIconModule],
  templateUrl: './appointment-history.component.html',
  styleUrl: './appointment-history.component.scss'
})
export class AppointmentHistoryComponent {

}
