import { TestBed } from '@angular/core/testing';

import { mocked, MockedObjectDeep } from 'ts-jest/dist/utils/testing';

import { Config } from '@models/config';
import { IpAddress } from '@one-click-desktop/api-module';
import { ConfigurationService } from '@services/configuration/configuration.service';
import { ElectronService } from '@services/electron/electron.service';
import { LoggedInService } from '@services/loggedin/loggedin.service';
import { getIpAddressFixture, getLoginFixture } from '@testing/fixtures';

import { RdpService } from './rdp.service';

jest.mock('@services/electron/electron.service');
jest.mock('@services/loggedin/loggedin.service');
jest.mock('@services/configuration/configuration.service');

describe('RdpService', () => {
  let service: RdpService;
  let electronService: MockedObjectDeep<ElectronService>;
  let loggedInService: MockedObjectDeep<LoggedInService>;
  let configService: MockedObjectDeep<ConfigurationService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ElectronService, LoggedInService, ConfigurationService],
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

    configService = mocked(TestBed.inject(ConfigurationService));
    Object.defineProperty(configService, 'config', {
      get: jest.fn(),
    });
    jest.spyOn(configService, 'config', 'get').mockReturnValue(null);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createRdpConnection tests', () => {
    let address: IpAddress;

    beforeEach(() => {
      address = getIpAddressFixture();
      jest.spyOn(electronService, 'isElectronApp', 'get').mockReturnValue(true);
      jest.spyOn(electronService, 'isWindows', 'get').mockReturnValue(true);
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
      service.createRdpConnection(address).subscribe(next, error, complete);
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

    test('should call spawnChild with windows params when isWindows', (done) => {
      electronService.spawnChild.mockReturnValueOnce(null);

      call({
        done,
        error: () => {
          expect(electronService.spawnChild).toHaveBeenCalledWith('mstsc.exe', [
            `-v:${address.address}:${address.port}`,
          ]);
          done();
        },
      });
    });

    test('should call spawnChild with linux params when isLinux', (done) => {
      electronService.spawnChild.mockReturnValueOnce(null);
      jest.spyOn(electronService, 'isLinux', 'get').mockReturnValue(true);
      jest.spyOn(electronService, 'isWindows', 'get').mockReturnValue(null);

      call({
        done,
        error: () => {
          expect(electronService.spawnChild).toHaveBeenCalledWith('xfreerdp', [
            `/v:${address.address}:${address.port}`,
            '/cert:tofu',
          ]);
          done();
        },
      });
    });

    test('should call spawnChild with linux params with login when isLinux and useRdpCredentials', (done) => {
      electronService.spawnChild.mockReturnValueOnce(null);
      jest.spyOn(electronService, 'isLinux', 'get').mockReturnValue(true);
      jest.spyOn(electronService, 'isWindows', 'get').mockReturnValue(null);
      jest
        .spyOn(configService, 'config', 'get')
        .mockReturnValue({ useRdpCredentials: true } as Config);

      const login = getLoginFixture();
      loggedInService.getLogin.mockReturnValue(login);

      call({
        done,
        error: () => {
          expect(electronService.spawnChild).toHaveBeenCalledWith('xfreerdp', [
            `/v:${address.address}:${address.port}`,
            '/cert:tofu',
            `/u:${login.login}`,
            `/p:${login.password}`,
          ]);
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
