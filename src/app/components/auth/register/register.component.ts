import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatCheckboxModule,
    CommonModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  currentStep = 1;
  showPassword = false;

  formData = {
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    location: '',
    specialization: '',
    medicalLicense: null as File | null,
    certificate: null as File | null
  };

  constructor() { }

  nextStep() {
    // if (this.validateCurrentStep()) {
    //   this.currentStep++;
    // }
    this.currentStep++;
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  validateCurrentStep() {
    if (this.currentStep === 1) {
      return this.formData.name && 
             this.formData.email && 
             this.formData.phoneNumber && 
             this.formData.password && 
             this.formData.location;
    }
    return true;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  getCurrentLocation() {
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(
    //     (position) => {
    //       const lat = position.coords.latitude;
    //       const lng = position.coords.longitude;
    //       // You can use reverse geocoding service here to get address
    //       this.formData.location = `${lat}, ${lng}`;
    //     },
    //     (error) => {
    //       console.error('Error getting location:', error);
    //     }
    //   );
    // }
  }

  onFileSelected(event: any, fieldName: string) {
    const file = event.target.files[0];
    if (file) {
      if (fieldName === 'medicalLicense') {
        this.formData.medicalLicense = file;
      } else if (fieldName === 'certificate') {
        this.formData.certificate = file;
      }
    }
  }

  triggerFileInput(inputId: string) {
    const fileInput = document.getElementById(inputId) as HTMLInputElement;
    fileInput.click();
  }

  submitForm() {
    if (this.validateForm()) {
      // Handle form submission
      console.log('Form submitted:', this.formData);
      // Call your registration service here
    }
  }
  validateForm(): boolean {
    return this.formData.specialization !== '' && 
           this.formData.medicalLicense !== null && 
           this.formData.certificate !== null;
  }

}
