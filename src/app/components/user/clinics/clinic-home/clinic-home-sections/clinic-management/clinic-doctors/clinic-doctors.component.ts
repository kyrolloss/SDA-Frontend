// clinic-doctors.component.ts
import { Component, OnInit } from '@angular/core';
import { ClinicService } from '../../../../clinic.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SearchComponent } from '../../../../../../shared/search/search.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-clinic-doctors',
  standalone: true,
  imports: [CommonModule, TranslateModule, SearchComponent, MatIcon, RouterLink],
  templateUrl: './clinic-doctors.component.html',
  styleUrl: './clinic-doctors.component.scss'
})
export class ClinicDoctorsComponent implements OnInit {
  clinicId: string = ''; 
  page: number = 1;
  limit: number = 10; 
  doctors: any;
  
  // أسماء الأيام - الأسبوع يبدأ من السبت (0)
  dayNames: { [key: string]: string } = {
    '0': 'Saturday',
    '1': 'Sunday',
    '2': 'Monday',
    '3': 'Tuesday',
    '4': 'Wednesday',
    '5': 'Thursday',
    '6': 'Friday'
  };

  constructor(
    private clinicService: ClinicService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.clinicId = this.route.parent?.parent?.snapshot.paramMap.get('id') || '';
    console.log("DONIA ID: ", this.clinicId);
    this.loadDoctors();
  }

  loadDoctors() {
    if (this.clinicId) {
      this.clinicService.getDoctorsForClinic(this.clinicId, this.page, this.limit)
        .subscribe((response) => {
          this.doctors = response.data;
          console.log("Doctors: ", this.doctors);
        });
    }
  }

  // فانكشن لاستخراج الأيام والمواعيد من الـ schedule
  getScheduleDays(schedule: any): any[] {
    if (!schedule) return [];
    
    const days: any[] = [];
    
    // نلف على كل يوم في الـ schedule
    Object.keys(schedule).forEach(dayNumber => {
      const slots = schedule[dayNumber];
      
      if (slots && slots.length > 0) {
        slots.forEach((slot: any) => {
          days.push({
            dayNumber: dayNumber,
            startTime: slot.startTime,
            endTime: slot.endTime
          });
        });
      }
    });
    
    return days;
  }

  // فانكشن لتحويل رقم اليوم لاسم اليوم
  getDayName(dayNumber: string): string {
    return this.dayNames[dayNumber] || '';
  }

  onSearch() {
    console.log('Searching...');
  }
}