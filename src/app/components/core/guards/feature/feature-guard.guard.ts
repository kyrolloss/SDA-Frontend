import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { ClinicFeaturesService } from '../../services/clinic-features.service';

@Injectable({
  providedIn: 'root'
})
export class FeatureGuard implements CanActivate {

  constructor(
    private featureService: ClinicFeaturesService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const featureKey = route.data['feature']; // اسم الفيتشر من الراوت
    const feature = this.featureService.getFeature(featureKey);

    if (!feature || feature.type === 'none') {
      // ❌ لو الفيتشر مش متاحة → ارجعي المستخدم
      // alert(`This feature (${featureKey}) is available only for PRO users.`);
      // this.router.navigate(['/dashboard/clinics']);
      return false;
    }

    return true; // ✅ feature متاحة
  }
}
