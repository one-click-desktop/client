import { TestBed } from '@angular/core/testing';

import { Chance } from 'chance';
import { mocked, MockedObject } from 'ts-jest/dist/utils/testing';

import { ElectronService } from '@services/electron/electron.service';

import { ConfigurationService } from './configuration.service';

jest.mock('@services/electron/electron.service');

const chance = new Chance();

describe('ConfigurationService', () => {
  let service: ConfigurationService;
  let electronService: MockedObject<ElectronService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ElectronService],
    });
    service = TestBed.inject(ConfigurationService);
    electronService = mocked(TestBed.inject(ElectronService));
    electronService.readFile.mockImplementation(() => null);
    electronService.showDialog.mockImplementation();
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('getConfiguration should return configuration with function as credentials.bearerAuth', () => {
    const conf = ConfigurationService.getConfiguration();

    expect(typeof conf.credentials.bearerAuth).toBe('function');
  });

  test('getConfiguration should return accessToken as function returning set token', () => {
    const token = chance.string();
    service.token = token;

    const conf = ConfigurationService.getConfiguration();

    expect((conf.credentials.bearerAuth as () => string)()).toBe(token);
  });

  test('getConfiguration should return set basePath', () => {
    const basePath = chance.string();
    service.basePath = basePath;

    const conf = ConfigurationService.getConfiguration();

    expect(conf.basePath).toBe(basePath);
  });

  test('loadConfiguration should call showDialog if file is null', () => {
    electronService.readFile.mockReturnValueOnce(null);

    service.loadConfiguration();

    expect(electronService.readFile).toHaveBeenCalled();
    expect(electronService.showDialog).toHaveBeenCalled();
  });

  test('loadConfiguration should set basePath and rabbitPath if loaded file is correct', () => {
    const file = chance.string();
    electronService.readFile.mockReturnValueOnce(file);
    const spy = jest
      .spyOn(JSON, 'parse')
      .mockReturnValueOnce({ basePath: '', rabbitPath: '' });
    const baseSpy = jest.spyOn(service, 'basePath', 'set');
    const rabbitSpy = jest.spyOn(service, 'rabbitPath', 'set');

    service.loadConfiguration();

    expect(electronService.readFile).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
    expect(baseSpy).toHaveBeenCalled();
    expect(rabbitSpy).toHaveBeenCalled();
  });

  test('loadConfiguration should call showDialog if file is not correct', () => {
    const file = chance.string();
    electronService.readFile.mockReturnValueOnce(file);
    const spy = jest.spyOn(JSON, 'parse').mockReturnValueOnce({});

    service.loadConfiguration();

    expect(electronService.readFile).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
    expect(electronService.showDialog).toHaveBeenCalled();
  });
});
