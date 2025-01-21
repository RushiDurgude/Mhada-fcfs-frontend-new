import { TestBed } from '@angular/core/testing';

import { DigiMultipleNameCheckService } from './digi-multiple-name-check.service';

describe('DigiMultipleNameCheckService', () => {
  let service: DigiMultipleNameCheckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DigiMultipleNameCheckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
