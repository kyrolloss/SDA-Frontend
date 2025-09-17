import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { Router, RouterModule } from '@angular/router';
import { ApiServiceService } from '../../../api-service.service';

@Component({
  selector: 'app-clinics',
  standalone: true,
  imports: [TranslateModule, CommonModule, PaginationComponent , RouterModule],
  templateUrl: './clinics.component.html',
  styleUrl: './clinics.component.scss'
})
export class ClinicsComponent implements OnInit {
  constructor(private router: Router , private api : ApiServiceService) {}
  ownerCurrentPage = 1;
  operatorCurrentPage = 1;
  subOwnerCurrentPage = 1;
  ngOnInit(): void {
    this.fetchClinics();
  }
  fetchClinics(){
    this.api.get<any>('users/me/clinics').subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.error('Error fetching clinics:', err);
      }
    });
  }
  onOwnerPageChange(page: number) {
    this.ownerCurrentPage = page;
    console.log('Owner Clinics Page:', page);
  }

  onOperatorPageChange(page: number) {
    this.operatorCurrentPage = page;
    console.log('Operator Clinics Page:', page);
  }

  onSubOwnerPageChange(page: number) {
    this.subOwnerCurrentPage = page;
    console.log('Sub-owner Clinics Page:', page);
  }
  goToJoinClinic() {
    this.router.navigate(['/dashboard/clinics/join']);
  }
  goToOperatorPackage() {
    this.router.navigate(['/dashboard/clinics/operatorPackage']);
  }
  goToClinicPackage() {
    this.router.navigate(['/dashboard/clinics/clinicPackage']);
  }
  goToClinicDetails(id: number) {
    this.router.navigate(['/dashboard/clinics', id]);
  }
}
