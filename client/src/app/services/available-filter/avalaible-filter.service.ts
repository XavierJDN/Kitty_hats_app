import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvalaibleFilterService {
  authors: Subject<string> = new Subject();
  owners: Subject<string> = new Subject();
  constructor() { }
}
