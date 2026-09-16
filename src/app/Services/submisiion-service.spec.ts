import { TestBed } from '@angular/core/testing';

import { SubmisiionService } from './submisiion-service';

describe('SubmisiionService', () => {
  let service: SubmisiionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubmisiionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
