import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, concat, map, Observable, of } from 'rxjs';
import { ContactPayload, ContactResponse, PortfolioData } from './portfolio.models';
import { environment } from '../../environments/environment';
import portfolioFallback from '../../assets/data/portfolio.json';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  getPortfolio(): Observable<PortfolioData> {
    return concat(
      of(portfolioFallback as PortfolioData),
      this.http.get<{ success: boolean; data: PortfolioData }>(`${this.apiBaseUrl}/portfolio`).pipe(
        map((response) => response.data),
        catchError(() => of(portfolioFallback as PortfolioData))
      )
    );
  }

  sendContactMessage(payload: ContactPayload): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(`${this.apiBaseUrl}/contact`, payload);
  }
}
