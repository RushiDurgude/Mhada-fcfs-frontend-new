import { TestBed } from '@angular/core/testing';

import { OtpDialogService } from './otp-dialog.service';

describe('OtpDialogService', () => {
  let service: OtpDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OtpDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
