import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { HomeComponent } from '../home/home.component';
import { AboutComponent } from '../about/about.component';
import { ExperienceComponent } from '../experience/experience.component';
import { ProjectsComponent } from '../projects/projects.component';
import { SkillsComponent } from '../skills/skills.component';
import { ContactComponent } from '../contact/contact.component';

import { PortfolioData } from '../../data/portfolio.models';
import { PortfolioService } from '../../data/portfolio.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    HomeComponent,
    AboutComponent,
    ExperienceComponent,
    ProjectsComponent,
    SkillsComponent,
    ContactComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  private readonly portfolioService = inject(PortfolioService);
  private readonly destroyRef = inject(DestroyRef);

  portfolio: PortfolioData | null = null;
  loading = true;
  errorMessage = '';
  currentYear = new Date().getFullYear();

  ngOnInit(): void {
    this.portfolioService
      .getPortfolio()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data:PortfolioData) => {
          console.log('Portfolio data loaded:', data);
          this.portfolio = data;
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'Unable to load portfolio data right now.';
          this.loading = false;
        },
      });
  }

  openResume(): void {
    
  }
}
