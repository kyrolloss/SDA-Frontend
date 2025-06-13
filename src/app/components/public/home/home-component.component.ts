import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-component',
  standalone: true,
  templateUrl: './home-component.component.html',
  styleUrls: ['./home-component.component.scss']
})
export class HomeComponentComponent {
  constructor(private router: Router) {}

  activeSection: string = 'home';
  manualScrolling: boolean = false;

  scrollToSection(id: string) {
    this.manualScrolling = true;
    this.activeSection = id;

    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setTimeout(() => {
      this.manualScrolling = false;
    }, 800);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.manualScrolling) return; 

    const sections = ['home', 'about', 'contact'];
    for (let section of sections) {
      const el = document.getElementById(section);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 80 && rect.bottom >= 80) {
          this.activeSection = section;
          break;
        }
      }
    }
  }
}
