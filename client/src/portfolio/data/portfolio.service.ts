import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ContactPayload, ContactResponse, PortfolioData } from './portfolio.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  getPortfolio(): Observable<PortfolioData> {
    return this.http.get<{ success: boolean; data: PortfolioData }>(`${this.apiBaseUrl}/portfolio`).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  sendContactMessage(payload: ContactPayload): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(`${this.apiBaseUrl}/contact`, payload);
  }
}