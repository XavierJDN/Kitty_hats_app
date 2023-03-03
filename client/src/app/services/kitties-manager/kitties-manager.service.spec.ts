import { TestBed } from '@angular/core/testing';

import { KittiesManagerService } from './kitties-manager.service';

describe('KittiesManagerService', () => {
  let service: KittiesManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KittiesManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
