import { TestBed } from '@angular/core/testing';

import { CreateGrievanceService } from './create-grievance.service';

describe('CreateGrievanceService', () => {
  let service: CreateGrievanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateGrievanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
