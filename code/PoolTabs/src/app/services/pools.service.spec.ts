import { TestBed } from '@angular/core/testing';

import { PoolsService } from './pools.service';

describe('PoolsService', () => {
  let service: PoolsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoolsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
