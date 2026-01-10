import { LabService } from './../lab.service';
import { Component, OnInit, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

type LabsSource = 'none' | 'normal' | 'nearby';

@Component({
  selector: 'app-lab',
  standalone: true,
  imports: [TranslateModule, CommonModule],
  templateUrl: './lab.component.html',
  styleUrl: './lab.component.scss',
})
export class LabComponent implements OnInit {
  // =====================
  // DATA
  // =====================
  labs = signal<any[]>([]);
  total = signal(0);
  loading = signal(false);

  // =====================
  // PAGINATION & SEARCH
  // =====================
  page = signal(1);
  limit = signal(1);
  searchNameValue = '';
  search = signal('');

  // =====================
  // MODE
  // =====================
  isNearbyMode = signal(false);
  labsSource = signal<LabsSource>('none');

  // =====================
  // LOCATION
  // =====================
  lat: number | null = null;
  lng: number | null = null;
  readonly distanceInKm = 20;

  constructor(
    private _LabService: LabService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadNormalLabs();
  }

  loadNormalLabs(): void {
    this.loading.set(true);
    this.isNearbyMode.set(false);

    const params: any = {
      page: this.page(),
      limit: this.limit(),
    };

    this._LabService
      .getLabs(params)
      .then((res) => {
        this.labs.set(res.data);
        this.total.set(res.total);

        if (res.data.length > 0) {
          queueMicrotask(() => {
            this.router.navigate(['/dashboard/labs/system']);
          });
        } else {
          this.labsSource.set('none');
        }
      })
      .finally(() => this.loading.set(false));
  }

  onFindNearby() {
    this.router.navigate(['/dashboard/labs/nearby']);
  }
}
