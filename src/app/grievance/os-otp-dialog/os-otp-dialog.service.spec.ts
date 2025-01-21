import { TestBed } from '@angular/core/testing';

import { OsOtpDialogService } from './os-otp-dialog.service';

describe('OsOtpDialogService', () => {
  let service: OsOtpDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OsOtpDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
