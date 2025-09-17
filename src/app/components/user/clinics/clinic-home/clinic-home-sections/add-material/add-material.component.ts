import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationComponent } from '../../../../../shared/pagination/pagination.component';

@Component({
  selector: 'app-add-material',
  standalone: true,
  imports: [TranslateModule, MatIconModule, RouterLink, CommonModule,PaginationComponent],
  templateUrl: './add-material.component.html',
  styleUrl: './add-material.component.scss'
})
export class AddMaterialComponent {

  CurrentPage = 1;
  onPageChange(number:any){
    
  }

}
