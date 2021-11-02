import { TestBed } from '@angular/core/testing';

import { RdpService } from './rdp.service';

describe('RdpService', () => {
  let service: RdpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RdpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
