import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { studentguardGuard } from './studentguard-guard';

describe('studentguardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => studentguardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
