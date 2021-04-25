import { TestBed } from '@angular/core/testing';

import { CheckuserService } from './checkuser.service';

describe('CheckuserService', () => {
  let service: CheckuserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckuserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
