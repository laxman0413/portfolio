import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioData } from '../../data/portfolio.models';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent {
  @Input() portfolio!: PortfolioData;
}
