import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioData } from '../../data/portfolio.models';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  @Input() portfolio!: PortfolioData;
}
