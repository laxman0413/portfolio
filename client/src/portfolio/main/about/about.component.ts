import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioData } from '../../data/portfolio.models';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  @Input() portfolio!: PortfolioData;
}
