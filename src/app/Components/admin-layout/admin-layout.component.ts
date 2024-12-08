import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { TabMenuModule } from 'primeng/tabmenu';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, TabMenuModule, MenuModule],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {

  items: MenuItem[] | undefined;

    ngOnInit() {
        this.items = [
            { label: 'Dashboard', icon: 'pi pi-home', routerLink:'dashboard'},
            { label: 'Student Management', icon: 'pi pi-user', routerLink:'student-management' },
            { label: 'Course Management', icon: 'pi pi-book', routerLink:'course-management' },
            { label: 'Payments', icon: 'pi pi-money-bill', routerLink:'payments' },
            { label: 'Institute Management', icon: 'pi pi-building-columns', routerLink:'institute-management' },
            { label: 'Study Materials', icon: 'pi pi-tags', routerLink:'study-materials' }
        ]
    }
    
}
