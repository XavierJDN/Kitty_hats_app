import { TestBed } from '@angular/core/testing';

import { AvailableFilterService } from './available-filter.service';

describe('AvailableFilterService', () => {
  let service: AvailableFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvailableFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
