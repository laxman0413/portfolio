import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioData } from '../../data/portfolio.models';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss',
})
export class ExperienceComponent {
  @Input() portfolio!: PortfolioData;
}
