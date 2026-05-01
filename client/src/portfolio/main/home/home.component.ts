import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioData } from '../../data/portfolio.models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  @Input() portfolio!: PortfolioData;

  get roleParts(): string[] {
    return this.portfolio?.personal.role.split(' ') ?? [];
  }

  get rolePrimary(): string {
    const parts = this.roleParts;
    return parts.slice(0, -1).join(' ') || parts[0] || '';
  }

  get roleSecondary(): string {
    const parts = this.roleParts;
    return parts.at(-1) ?? '';
  }
}
