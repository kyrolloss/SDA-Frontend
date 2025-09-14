import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-clinic-home-section',
  standalone: true,
  imports: [],
  templateUrl: './clinic-home-section.component.html',
  styleUrl: './clinic-home-section.component.scss'
})
export class ClinicHomeSectionComponent {
clinicId!:  any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.clinicId = this.route.parent?.snapshot.paramMap.get('id');
    console.log('Child Clinic ID from parent:', this.clinicId);
  }
}
