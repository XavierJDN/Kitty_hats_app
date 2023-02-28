import { TestBed } from '@angular/core/testing';

import { AvalaibleFilterService } from './avalaible-filter.service';

describe('AvalaibleFilterService', () => {
  let service: AvalaibleFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvalaibleFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
