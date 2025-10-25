import { TestBed } from '@angular/core/testing';

import { DispensacionService } from './services/dispensacion.service';

describe('DispensacionService', () => {
  let service: DispensacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DispensacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
