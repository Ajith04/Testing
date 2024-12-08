import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { RatingModule } from 'primeng/rating';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Expense, IMService } from '../../Services/im.service';

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [TableModule, TagModule, RatingModule, ButtonModule, CommonModule, ImageModule],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.css'
})
export class ExpenseComponent {

  allExpenses: Expense[] = [];

  constructor(private imService: IMService) {}

  ngOnInit() {
    this.getAllExpenses();

  }

  getAllExpenses(){
    this.imService.getAllExpenses().subscribe({next:(data:Expense[]) => {
      this.allExpenses = data;
  }});
  }

}
