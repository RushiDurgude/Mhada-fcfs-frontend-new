import { TestBed } from '@angular/core/testing';

import { ViewGrievanceService } from './view-grievance.service';

describe('ViewGrievanceService', () => {
  let service: ViewGrievanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewGrievanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
