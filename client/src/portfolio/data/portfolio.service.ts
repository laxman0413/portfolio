import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { ContactPayload, ContactResponse, PortfolioData } from './portfolio.models';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:3000/api';

  getPortfolio(): Observable<PortfolioData> {
    return this.http.get(`${this.apiBaseUrl}/portfolio`).pipe(
      map((response:any) => {
        console.log('Received portfolio data:', response);
        return response.data;
      })
    )
  }

  sendContactMessage(payload: ContactPayload): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(`${this.apiBaseUrl}/contact`, payload);
  }
}