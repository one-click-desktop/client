import { TestBed } from '@angular/core/testing';

import { Chance } from 'chance';
import { mocked, MockedObjectDeep } from 'ts-jest/dist/utils/testing';

import { MachineType, Session } from '@api-module/model/models';
import { ElectronService } from '@services/electron/electron.service';

import { RdpService } from './rdp.service';

const chance = new Chance();

jest.mock('@services/electron/electron.service');

describe('RdpService', () => {
  let service: RdpService;
  let electronService: MockedObjectDeep<ElectronService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ElectronService],
    });
    service = TestBed.inject(RdpService);
    electronService = mocked(TestBed.inject(ElectronService), true);
    electronService.childProcess = mocked(
      jest.createMockFromModule('child_process'),
      false
    );
    electronService.childProcess.spawn.mockReturnValue(null);
    Object.defineProperty(electronService, 'isElectronApp', {
      get: jest.fn(),
    });
    Object.defineProperty(electronService, 'isWindows', {
      get: jest.fn(),
    });
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createRdpConnection tests', () => {
    let session: Session;

    beforeEach(() => {
      session = { id: chance.guid(), type: MachineType.Cpu };
      jest.spyOn(electronService, 'isElectronApp', 'get').mockReturnValue(true);
    });

    interface RdpCall {
      done: jest.DoneCallback;
      next?: () => void;
      error?: (error: any) => void;
      complete?: () => void;
    }

    function call({
      done = null,
      next = () => {
        done.fail();
      },
      error = () => {
        done.fail();
      },
      complete = () => {
        done.fail();
      },
    }: RdpCall): void {
      service.createRdpConnection(session).subscribe(next, error, complete);
    }

    test('should emit error when is not electron app', (done) => {
      jest
        .spyOn(electronService, 'isElectronApp', 'get')
        .mockReturnValueOnce(false);

      call({
        done,
        error: (error) => {
          expect(error).toBe('Not an Electron app');
          done();
        },
      });
    });

    test('should emit error when created process is null', (done) => {
      electronService.childProcess.spawn.mockReturnValueOnce(null);

      call({
        done,
        error: (error) => {
          expect(error).toBe('Failed to create process');
          expect(electronService.childProcess.spawn).toHaveBeenCalled();
          done();
        },
      });
    });

    test('should emit next when created process is not null', (done) => {
      electronService.childProcess.spawn.mockReturnValueOnce({
        on: jest.fn(),
      } as any);

      call({
        done,
        next: () => {
          expect(electronService.childProcess.spawn).toHaveBeenCalled();
          done();
        },
      });
    });

    test('should emit error when created process returns error', (done) => {
      electronService.childProcess.spawn.mockReturnValueOnce({
        on: jest.fn().mockImplementation((str: 'error' | 'close', callback) => {
          if (str === 'error') {
            callback('Process error');
          }
        }),
      } as any);

      call({
        done,
        next: () => {
          expect(electronService.childProcess.spawn).toHaveBeenCalled();
        },
        error: (error) => {
          expect(error).toBe('Process error');
          done();
        },
      });
    });

    test('should emit complete when created process close', (done) => {
      electronService.childProcess.spawn.mockReturnValueOnce({
        on: jest.fn().mockImplementation((str: 'error' | 'close', callback) => {
          if (str === 'close') {
            callback();
          }
        }),
      } as any);

      call({
        done,
        next: () => {
          expect(electronService.childProcess.spawn).toHaveBeenCalled();
        },
        complete: () => {
          done();
        },
      });
    });
  });
});
