import { TestBed } from '@angular/core/testing';

import { TypeheadService } from './typehead.service';

describe('TypeheadService', () => {
  let service: TypeheadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeheadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
