import { TestBed } from '@angular/core/testing';

import { MyGrievancesService } from './my-grievances.service';

describe('MyGrievancesService', () => {
  let service: MyGrievancesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyGrievancesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
