import { TestBed } from '@angular/core/testing';

import { Chance } from 'chance';
import { mocked } from 'ts-jest/utils';

import { ElectronService } from './electron.service';

const chance = new Chance();

describe('ElectronService', () => {
  let service: ElectronService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElectronService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});
