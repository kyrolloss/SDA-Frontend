import { Component, computed, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from 'express';
import { SearchComponent } from '../../../shared/search/search.component';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReferralService } from './referral.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-referral-case',
  standalone: true,
  imports: [
    TranslateModule,
    SearchComponent,
    CommonModule
  ],
  templateUrl: './referral-case.component.html',
  styleUrl: './referral-case.component.scss'
})
export class ReferralCaseComponent implements OnInit{
  
  constructor(
    private route:ActivatedRoute,
    private _MatSnackBar:MatSnackBar,
    private _ReferralService:ReferralService
  ){}

  selectedTab: 'refer_clinic' | 'refer_another_clinic' = 'refer_clinic';

  caseId:any;
  CurrentPage = signal(1);
  limit = signal(10);
  searchNameValue = ''; 
  searchName = signal('');
  DoctorsData:any[] = [];
  totalData = 0 ;
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('caseID', id)
  }

  // ⚙️ Computed params (auto-update when signals change)
    params = computed(() => ({
      page: this.CurrentPage(),
      limit: this.limit(),
      ...(this.searchName().trim() && { search: this.searchName().trim() }),
    }));
  
    patientsQuery = injectQuery(() => ({
    queryKey: ['doctors'], // ✅ shared key for caching
    queryFn: () => this._ReferralService.getDoctorsOfClinic(this.params()),
    throwError: (err:any) => {
      this._MatSnackBar.open(err.error.message, 'Close', {
        duration:3000,
        panelClass:['snackbar-error']
      });
    },
  }));
  
  //   get doctors() {
  //     return this.doctorsQuery.data()?.data || [];
  //   }
  //   get total() {
  //     return this.doctorsQuery.data()?.total || 0;
  //   }
  
    onSearch(){
      this.CurrentPage.set(1);
      this.searchName.set(this.searchNameValue);
      // this.patientsQuery.refetch();
    }
    onPageChange(page:number){
      this.CurrentPage.set(page);
      // this.patientsQuery.refetch();
    }

  
}
