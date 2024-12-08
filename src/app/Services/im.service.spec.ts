import { TestBed } from '@angular/core/testing';

import { IMService } from './im.service';

describe('IMService', () => {
  let service: IMService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IMService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
