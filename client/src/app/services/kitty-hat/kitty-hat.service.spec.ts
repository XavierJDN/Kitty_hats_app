import { TestBed } from '@angular/core/testing';

import { KittyHatService } from './kitty-hat.service';

describe('KittyHatService', () => {
  let service: KittyHatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KittyHatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
