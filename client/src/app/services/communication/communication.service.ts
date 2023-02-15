import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '@app/../environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  private readonly baseUrl = environment.serverUrl;
  constructor(private readonly http: HttpClient) {}

  getTokens(tokenId: string | undefined, isNext: boolean = true): Observable<any> {
    return !tokenId
      ? this.initializeTokensPage()
      : this.http.post(
          `${this.baseUrl}/tokens/`,
          { id: tokenId, isNext },
          { observe: 'response' }
        );
  }

  initializeTokensPage(limit: number = 30, state: number = 0): Observable<any> {
    return this.http
      .post(
        `${this.baseUrl}/tokens/`,
        { limit, state },
        { observe: 'response' }
      )
  }
}
