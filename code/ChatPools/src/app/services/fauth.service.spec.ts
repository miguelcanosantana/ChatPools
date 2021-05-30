import { TestBed } from '@angular/core/testing';

import { FauthService } from './fauth.service';

describe('FauthService', () => {
  let service: FauthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FauthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
