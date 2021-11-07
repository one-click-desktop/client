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
    service.fs = mocked(jest.createMockFromModule('fs'), false);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('readFile should call readFileSync', () => {
    const path = chance.string();
    const encoding = 'utf-8';
    service.readFile(path, encoding);

    expect(service.fs.readFileSync).toHaveBeenCalledWith(path, encoding);
  });
});
