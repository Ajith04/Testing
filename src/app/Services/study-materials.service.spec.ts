import { TestBed } from '@angular/core/testing';

import { StudyMaterialsService } from './study-materials.service';

describe('StudyMaterialsService', () => {
  let service: StudyMaterialsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudyMaterialsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
