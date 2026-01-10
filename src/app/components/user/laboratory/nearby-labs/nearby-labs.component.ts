import { Component } from '@angular/core';

@Component({
  selector: 'app-nearby-labs',
  standalone: true,
  imports: [],
  templateUrl: './nearby-labs.component.html',
  styleUrl: './nearby-labs.component.scss'
})
export class NearbyLabsComponent {

  ///// get user location
  // getUserLocationAndLoadNearby(): void {
  //   if (!navigator.geolocation) {
  //     this.snackBar.open('Geolocation not supported', 'Close', {
  //       duration: 3000,
  //     });
  //     return;
  //   }

  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       this.lat = position.coords.latitude;
  //       this.lng = position.coords.longitude;
  //       this.page.set(1);
  //       this.search.set('');
  //       this.loadNearbyLabsInitial();
  //     },
  //     () => {
  //       this.snackBar.open('Please allow location access', 'Close', {
  //         duration: 3000,
  //       });
  //     }
  //   );
  // }
  // loadNearbyLabsInitial(): void {
  //   if (this.lat === null || this.lng === null) return;

  //   this.loading.set(true);
  //   this.isNearbyMode.set(true);

  //   const params = {
  //     lat: this.lat,
  //     lng: this.lng,
  //     distanceInKm: this.distanceInKm,
  //     page: this.page(),
  //     limit: this.limit(),
  //   };

  //   this._LabService
  //     .getNearByLabs(params)
  //     .then((res) => {
  //       this.labs.set(res.data);
  //       this.total.set(res.total);

  //       if (res.data.length > 0) {
  //         this.labsSource.set('nearby');
  //       } else {
  //         // nearby رجّعت فاضية
  //         this.labsSource.set('none');
  //       }
  //     })
  //     .finally(() => this.loading.set(false));
  // }

}
