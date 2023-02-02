import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@app/../environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  private readonly baseUrl = environment.serverUrl;
  constructor(private readonly http: HttpClient) {}

  getTokens(): Observable<any> {
    return this.http.get(`${this.baseUrl}/tokens`, {observe: 'response'});
  }

  getToken(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/tokens/${id}`, {observe: 'response'});
  }
}
