import { Component , OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule  , ActivatedRoute} from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-doctor-details',
  standalone: true,
  imports: [TranslateModule , RouterModule , MatIconModule],
  templateUrl: './doctor-details.component.html',
  styleUrl: './doctor-details.component.scss'
})
export class DoctorDetailsComponent implements OnInit {


  clinicId: string | null = null;

  constructor(private route: ActivatedRoute) {
    this.route.queryParamMap.subscribe(params => {
      this.clinicId = params.get('clinicId');
    });
  }
 ngOnInit(): void {
   console.log(this.clinicId);
 }

}
