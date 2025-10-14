import { TestBed } from '@angular/core/testing';

import { PaseDeVisitaService } from './pase-de-visita.service';

describe('PaseDeVisitaService', () => {
  let service: PaseDeVisitaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaseDeVisitaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
