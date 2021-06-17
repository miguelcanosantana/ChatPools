import { TestBed } from '@angular/core/testing';

import { FireAuthService } from './fire-auth.service';

describe('FireAuthService', () => {
  let service: FireAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FireAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
