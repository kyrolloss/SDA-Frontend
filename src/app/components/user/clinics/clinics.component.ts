import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClinicService } from './clinic.service';
import { MatIconModule } from '@angular/material/icon';
import { SearchComponent } from '../../shared/search/search.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { ClinicFeaturesService } from '../../core/services/clinic-features.service';
import { features } from 'process';

@Component({
  selector: 'app-clinics',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    PaginationComponent,
    RouterModule,
    FormsModule,
    MatIconModule,
    SearchComponent
  ],
  templateUrl: './clinics.component.html',
  styleUrl: './clinics.component.scss'
})
export class ClinicsComponent {
  constructor(
    private router: Router,
    private clinicsService: ClinicService,
    private _MatSnackBar: MatSnackBar,
    private _ClinicFeaturesService:ClinicFeaturesService
  ) {}

  // 🔹 Reactive signals for state
  ownerCurrentPage = signal(1);
  operatorCurrentPage = signal(1);
  subOwnerCurrentPage = signal(1);
  limit = signal(10);
  searchName = signal('');
  searchNameValue = ''; 

  // ⚙️ Computed params that trigger auto re-fetch
  params = computed(() => ({
    ownerPage: this.ownerCurrentPage(),
    operatorPage: this.operatorCurrentPage(),
    subOwnerPage: this.subOwnerCurrentPage(),
    limit: this.limit(),
    name: this.searchName().trim(),
  }));

  // 🔹 TanStack query (auto caching + reactive)
  clinicsQuery = injectQuery(() => ({
    queryKey: ['clinics'],
    queryFn: () => this.clinicsService.getClinics(this.params()),
    throwError: (err:any) => {
    this._MatSnackBar.open(err.error.message, 'Close', {
      duration:3000,
      panelClass:['snackbar-error']
    });
  },
  }));

  // 🧩 Getters for easy template use
  get isLoading() {
    return this.clinicsQuery.isLoading();
  }

  get data(): any {
  const response:any = this.clinicsQuery.data() || {};

  // 🧩 Inject static features مؤقتًا
  if (response?.ownerClinics?.data?.length) {
    response.ownerClinics.data = response.ownerClinics.data.map((clinic:any, index:any) => {
      if (index === 0) {
        // 🟢 Premium package — everything unlimited
        clinic.features = {
          add_material: { type: 'unlimited' },
          assigned_cases: { type: 'unlimited' },
          inventory: { type: 'unlimited' },
        };
      } else if (index === 1) {
        // 🔴 Basic package — assigned_cases locked (pro)
        clinic.features = {
          add_material: { type: 'unlimited' },
          assigned_cases: { type: 'none' }, // PRO feature
          inventory: { type: 'unlimited' },
        };
      } else {
        // 🟠 Standard package — add_material limited
        clinic.features = {
          add_material: { type: 'limited', limit: 10, remaining: 3 },
          assigned_cases: { type: 'unlimited' },
          inventory: { type: 'unlimited' },
        };
      }
      return clinic;
    });
  }

  return response;
}


  get ownerClinics() {
    return this.data?.ownerClinics?.data || [];
  }

  get operatorClinics() {
    return this.data?.operatorClinics?.data || [];
  }

  get subOwnerClinics() {
    return this.data?.subOwnerClinics?.data || [];
  }

  get ownerTotal() {
    return this.data?.ownerClinics?.total || 0;
  }

  get operatorTotal() {
    return this.data?.operatorClinics?.total || 0;
  }

  get subOwnerTotal() {
    return this.data?.subOwnerClinics?.total || 0;
  }

  // 🔹 Search handler
  onSearch() {
    this.searchName.set(this.searchNameValue);
    this.ownerCurrentPage.set(1);
    this.operatorCurrentPage.set(1);
    this.subOwnerCurrentPage.set(1);
    this.clinicsQuery.refetch();
  }

  // 🔹 Pagination handlers
  onOwnerPageChange(page: number) {
    this.ownerCurrentPage.set(page);
    this.clinicsQuery.refetch();
  }

  onOperatorPageChange(page: number) {
    this.operatorCurrentPage.set(page);
    this.clinicsQuery.refetch();
  }

  onSubOwnerPageChange(page: number) {
    this.subOwnerCurrentPage.set(page);
    this.clinicsQuery.refetch();
  }

  // 🔹 Navigation
  goToJoinClinic() {
    this.router.navigate(['/dashboard/clinics/join']);
  }

  goToOperatorPackage() {
    this.router.navigate(['/dashboard/clinics/operatorPackage']);
  }

  goToClinicPackage() {
    this.router.navigate(['/dashboard/clinics/clinicPackage']);
  }

  goToClinicDetails(clinic: any) {
    this._ClinicFeaturesService.setClinicFeatures(clinic.features);
    console.log(clinic)
    this.router.navigate(['/dashboard/clinics', clinic.id]);
  }
}
