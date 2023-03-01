import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '@app/../environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  private readonly baseUrl = environment.serverUrl;
  pageId: string | undefined;

  constructor(private readonly http: HttpClient) {}

  getTokens(filter: { author: string, owner: string} | undefined, isNext: boolean = true): Observable<any> {
    this.pageId = !filter  ? this.pageId : undefined;
    return !this.pageId
      ? this.initializeTokensPage(filter)
      : this.http.post(
          `${this.baseUrl}/tokens/`,
          { id: this.pageId, isNext },
          { observe: 'response' }
        );
  }

  getAllArtists(): Observable<any> {
    return this.http.get(`${this.baseUrl}/tokens/artists`, { observe: 'response' });
  }

  private initializeTokensPage(filter: { author: string, owner: string} | undefined, limit: number = 30, state: number = 0): Observable<any> {
    return this.http
      .post(
        `${this.baseUrl}/tokens/`,
        { limit, state, ...filter },
        { observe: 'response' }
      )
  }
}
