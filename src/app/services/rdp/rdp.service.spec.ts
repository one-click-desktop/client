import { TestBed } from '@angular/core/testing';

import { Chance } from 'chance';
import { mocked, MockedObjectDeep } from 'ts-jest/dist/utils/testing';

import { Session } from '@one-click-desktop/api-module';
import { ElectronService } from '@services/electron/electron.service';
import { LoggedInService } from '@services/loggedin/loggedin.service';
import { getLoginFixture, getSessionFixture } from '@testing/fixtures';

import { RdpService } from './rdp.service';

const chance = new Chance();

jest.mock('@services/electron/electron.service');
jest.mock('@services/loggedin/loggedin.service');

describe('RdpService', () => {
  let service: RdpService;
  let electronService: MockedObjectDeep<ElectronService>;
  let loggedInService: MockedObjectDeep<LoggedInService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ElectronService, LoggedInService],
    });
    service = TestBed.inject(RdpService);

    electronService = mocked(TestBed.inject(ElectronService), true);
    Object.defineProperty(electronService, 'isElectronApp', {
      get: jest.fn(),
    });
    Object.defineProperty(electronService, 'isWindows', {
      get: jest.fn(),
    });
    Object.defineProperty(electronService, 'isLinux', {
      get: jest.fn(),
    });

    loggedInService = mocked(TestBed.inject(LoggedInService));
    loggedInService.getLogin.mockReturnValue(getLoginFixture());
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createRdpConnection tests', () => {
    let session: Session;

    beforeEach(() => {
      session = getSessionFixture();
      jest.spyOn(electronService, 'isElectronApp', 'get').mockReturnValue(true);
      jest.spyOn(electronService, 'isWindows', 'get').mockReturnValueOnce(true);
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
      electronService.spawnChild.mockReturnValueOnce(null);

      call({
        done,
        error: (error) => {
          expect(error).toBe('Failed to create process');
          expect(electronService.spawnChild).toHaveBeenCalled();
          done();
        },
      });
    });

    test('should emit next when created process emits spawn', (done) => {
      electronService.spawnChild.mockReturnValueOnce({
        on: jest
          .fn()
          .mockImplementation((str: 'error' | 'close' | 'spawn', callback) => {
            if (str === 'spawn') {
              callback();
            }
          }),
      } as any);

      call({
        done,
        next: () => {
          expect(electronService.spawnChild).toHaveBeenCalled();
          done();
        },
      });
    });

    test('should emit error when created process emits error', (done) => {
      electronService.spawnChild.mockReturnValueOnce({
        on: jest
          .fn()
          .mockImplementation((str: 'error' | 'close' | 'spawn', callback) => {
            if (str === 'error') {
              callback('Process error');
            }
          }),
      } as any);

      call({
        done,
        next: () => {
          expect(electronService.spawnChild).toHaveBeenCalled();
        },
        error: (error) => {
          expect(error).toBe('Process error');
          done();
        },
      });
    });

    test('should emit complete when created process close', (done) => {
      electronService.spawnChild.mockReturnValueOnce({
        on: jest
          .fn()
          .mockImplementation((str: 'error' | 'close' | 'spawn', callback) => {
            if (str === 'close') {
              callback();
            }
          }),
      } as any);

      call({
        done,
        next: () => {
          expect(electronService.spawnChild).toHaveBeenCalled();
        },
        complete: () => {
          done();
        },
      });
    });
  });
});
