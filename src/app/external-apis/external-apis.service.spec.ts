import { TestBed } from '@angular/core/testing';

import { ExternalApisService } from './external-apis.service';

describe('ExternalApisService', () => {
  let service: ExternalApisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExternalApisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
