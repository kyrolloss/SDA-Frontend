import { TestBed } from '@angular/core/testing';

import { ClinicFeaturesService } from './clinic-features.service';

describe('ClinicFeaturesService', () => {
  let service: ClinicFeaturesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClinicFeaturesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
